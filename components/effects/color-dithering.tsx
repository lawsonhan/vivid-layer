"use client"

import { useEffect, useRef, type CSSProperties } from "react"

import {
  blueNoiseBase64,
  blueNoiseSize,
} from "@/components/effects/blue-noise-64"

export type ColorDitheringAlgorithm =
  | "bayer-2x2"
  | "bayer-4x4"
  | "bayer-8x8"
  | "blue-noise"
  | "white-noise"

export interface ColorDitheringProps {
  /** Image URL. Cross-origin images must allow anonymous CORS loading. */
  image: string
  width?: CSSProperties["width"]
  height?: CSSProperties["height"]
  className?: string
  style?: CSSProperties
  /** How the image fills the container. */
  fit?: "cover" | "contain"
  /** Zoom around the centre. */
  scale?: number
  /** Threshold pattern: an ordered Bayer matrix, blue noise or white noise. */
  algorithm?: ColorDitheringAlgorithm
  /** Cell size in CSS pixels. */
  pixelSize?: number
  /** Dither strength: 0 posterizes, 1 is full ordered dithering. */
  spread?: number
  /** Tones per channel when no palette is set. */
  levels?: number
  /** Up to 16 palette colours; empty keeps the source colours. */
  colors?: readonly string[]
  /** Offsets the threshold pattern per channel for coloured dots. */
  chromaticSplit?: boolean
  /** Dot coverage inside each cell; below 1 leaves paper between dots. */
  dotScale?: number
  /** Colour of the paper between dots. */
  paperColor?: string
  /** Paper opacity; 0 leaves the gaps transparent. */
  paperOpacity?: number
  brightness?: number
  contrast?: number
  saturation?: number
  onError?: (error: Error) => void
}

const MAX_PALETTE = 16
const MAX_PIXEL_RATIO = 2

const algorithmIds: Record<ColorDitheringAlgorithm, number> = {
  "bayer-2x2": 0,
  "bayer-4x4": 1,
  "bayer-8x8": 2,
  "blue-noise": 3,
  "white-noise": 4,
}

const vertexShader = `#version 300 es
void main() {
  vec2 corner = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(corner * 2.0 - 1.0, 0.0, 1.0);
}`

/* The whole effect runs in linear light: the source is decoded from sRGB,
 * adjusted, and dithered between neighbouring display tones by comparing
 * linear values, so mixed cells average to the tone they stand in for. */
const fragmentShader = `#version 300 es
precision highp float;
precision highp int;

uniform sampler2D uImage;
uniform sampler2D uNoise;
uniform vec2 uCanvasSize;
uniform vec2 uImageSize;
uniform float uCover;
uniform float uScale;
uniform float uPixelSize;
uniform float uSpread;
uniform float uLevels;
uniform float uDotScale;
uniform float uChromatic;
uniform float uBrightness;
uniform float uContrast;
uniform float uSaturation;
uniform float uPaperOpacity;
uniform vec3 uPaper;
uniform int uAlgorithm;
uniform int uPaletteCount;
uniform vec3 uPaletteLab[${MAX_PALETTE}];
uniform vec3 uPaletteRgb[${MAX_PALETTE}];

out vec4 fragColor;

float srgbToLinear(float c) {
  return c <= 0.04045 ? c / 12.92 : pow((c + 0.055) / 1.055, 2.4);
}
vec3 srgbToLinear(vec3 c) {
  return vec3(srgbToLinear(c.r), srgbToLinear(c.g), srgbToLinear(c.b));
}
float linearToSrgb(float c) {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * pow(c, 1.0 / 2.4) - 0.055;
}
vec3 linearToSrgb(vec3 c) {
  return vec3(linearToSrgb(c.r), linearToSrgb(c.g), linearToSrgb(c.b));
}

vec3 linearToOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  float l_ = pow(l, 1.0 / 3.0);
  float m_ = pow(m, 1.0 / 3.0);
  float s_ = pow(s, 1.0 / 3.0);
  return vec3(
    0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_,
    1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_,
    0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_
  );
}

// Ordered thresholds by bit interleaving of (x ^ y) and y, MSB first.
float bayer(ivec2 p, int size) {
  int x = p.x & (size - 1);
  int y = p.y & (size - 1);
  int a = x ^ y;
  int v;
  if (size == 2) {
    v = ((a & 1) << 1) | (y & 1);
  } else if (size == 4) {
    v = ((a & 1) << 3) | ((y & 1) << 2) | (a & 2) | ((y & 2) >> 1);
  } else {
    v = ((a & 1) << 5) | ((y & 1) << 4) | ((a & 2) << 2) | ((y & 2) << 1)
      | ((a & 4) >> 1) | ((y & 4) >> 2);
  }
  return (float(v) + 0.5) / float(size * size);
}

float whiteNoise(ivec2 p, int channel) {
  vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973) + float(channel) * 0.37);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

// The threshold for one channel; channels differ only with chromatic split.
float threshold(ivec2 cell, int channel) {
  ivec2 shift = ivec2(channel == 1 ? 1 : 0, channel == 2 ? 1 : 0);
  ivec2 p = cell + int(uChromatic) * shift;
  if (uAlgorithm == 0) return bayer(p, 2);
  if (uAlgorithm == 1) return bayer(p, 4);
  if (uAlgorithm == 2) return bayer(p, 8);
  if (uAlgorithm == 4) return whiteNoise(cell, int(uChromatic) * channel);
  vec3 noise = texelFetch(uNoise, cell & (${blueNoiseSize} - 1), 0).rgb;
  return (uChromatic > 0.5 ? noise[channel] : noise.r) * 0.996 + 0.002;
}

// One channel dithered between the two display tones around it.
float ditherTone(float value, float t) {
  float steps = uLevels - 1.0;
  float lo = floor(value * steps) / steps;
  float hi = min(lo + 1.0 / steps, 1.0);
  float linLo = srgbToLinear(lo);
  float linHi = srgbToLinear(hi);
  float f = linHi > linLo ? (srgbToLinear(value) - linLo) / (linHi - linLo) : 0.0;
  return f + (t - 0.5) * uSpread > 0.5 ? hi : lo;
}

// The pixel dithered between its two nearest palette colours in Oklab.
vec3 ditherPalette(vec3 linearRgb, float t) {
  vec3 lab = linearToOklab(linearRgb);
  int first = 0;
  int second = 0;
  float firstDistance = 1e9;
  float secondDistance = 1e9;
  for (int i = 0; i < ${MAX_PALETTE}; i++) {
    if (i >= uPaletteCount) break;
    float d = distance(lab, uPaletteLab[i]);
    if (d < firstDistance) {
      second = first;
      secondDistance = firstDistance;
      first = i;
      firstDistance = d;
    } else if (d < secondDistance) {
      second = i;
      secondDistance = d;
    }
  }
  vec3 a = uPaletteLab[first];
  vec3 b = uPaletteLab[second];
  vec3 ab = b - a;
  float f = dot(ab, ab) > 0.0 ? clamp(dot(lab - a, ab) / dot(ab, ab), 0.0, 1.0) : 0.0;
  return f + (t - 0.5) * uSpread > 0.5 ? uPaletteRgb[second] : uPaletteRgb[first];
}

void main() {
  vec2 cellF = floor(gl_FragCoord.xy / uPixelSize);
  ivec2 cell = ivec2(cellF);
  vec2 cellCentre = (cellF + 0.5) * uPixelSize;

  // Fit the image to the canvas, then zoom around the centre.
  vec2 ratio = uCanvasSize / uImageSize;
  float s = uCover > 0.5 ? max(ratio.x, ratio.y) : min(ratio.x, ratio.y);
  vec2 shown = uImageSize * s;
  vec2 uv = (cellCentre - (uCanvasSize - shown) * 0.5) / shown;
  uv = (uv - 0.5) / uScale + 0.5;

  vec3 rgb = vec3(0.0);
  if (all(greaterThanEqual(uv, vec2(0.0))) && all(lessThanEqual(uv, vec2(1.0)))) {
    // Average the source over the cell through its mip chain.
    float lod = log2(max(uPixelSize / (s * uScale), 1.0));
    rgb = textureLod(uImage, uv, lod).rgb;
  }

  rgb = (rgb - 0.5) * uContrast + 0.5 + uBrightness;
  float luma = dot(rgb, vec3(0.2126, 0.7152, 0.0722));
  rgb = clamp(mix(vec3(luma), rgb, uSaturation), 0.0, 1.0);

  vec3 outSrgb;
  if (uPaletteCount > 0) {
    outSrgb = linearToSrgb(ditherPalette(srgbToLinear(rgb), threshold(cell, 0)));
  } else {
    outSrgb = vec3(
      ditherTone(rgb.r, threshold(cell, 0)),
      ditherTone(rgb.g, threshold(cell, 1)),
      ditherTone(rgb.b, threshold(cell, 2))
    );
  }

  // The dot is a whole number of device pixels, centred in the cell, so a
  // 2px cell at half coverage is one pixel of dot and one of paper.
  int cellPx = int(uPixelSize);
  int dotPx = max(1, int(floor(uDotScale * float(cellPx) + 0.5)));
  int inset = (cellPx - dotPx) / 2;
  ivec2 local = ivec2(gl_FragCoord.xy) - cell * cellPx - inset;
  bool dot_ = all(greaterThanEqual(local, ivec2(0))) && all(lessThan(local, ivec2(dotPx)));
  vec3 colour = dot_ ? outSrgb : uPaper;
  float alpha = dot_ ? 1.0 : uPaperOpacity;
  fragColor = vec4(colour * alpha, alpha);
}`

interface Uniforms {
  algorithm: number
  brightness: number
  chromatic: number
  contrast: number
  cover: number
  dotScale: number
  levels: number
  paletteLab: Float32Array
  paletteRgb: Float32Array
  paletteCount: number
  paper: [number, number, number]
  paperOpacity: number
  pixelSize: number
  saturation: number
  scale: number
  spread: number
}

function parseHex(hex: string): [number, number, number] {
  const value = hex.trim().replace(/^#/, "")
  const digits =
    value.length === 3 || value.length === 4
      ? value
          .slice(0, 3)
          .split("")
          .map((digit) => digit + digit)
          .join("")
      : value.slice(0, 6)
  const number = Number.parseInt(digits, 16)
  if (digits.length !== 6 || Number.isNaN(number)) {
    throw new Error(`Invalid colour: ${hex}`)
  }
  return [(number >> 16) & 255, (number >> 8) & 255, number & 255].map(
    (channel) => channel / 255
  ) as [number, number, number]
}

function srgbToLinear(c: number) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

function linearToOklab([r, g, b]: readonly [number, number, number]) {
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

function buildUniforms(props: Required<
  Pick<
    ColorDitheringProps,
    | "algorithm"
    | "brightness"
    | "chromaticSplit"
    | "colors"
    | "contrast"
    | "dotScale"
    | "fit"
    | "levels"
    | "paperColor"
    | "paperOpacity"
    | "pixelSize"
    | "saturation"
    | "scale"
    | "spread"
  >
>): Uniforms {
  const palette = props.colors.slice(0, MAX_PALETTE).map(parseHex)
  const paletteRgb = new Float32Array(MAX_PALETTE * 3)
  const paletteLab = new Float32Array(MAX_PALETTE * 3)
  palette.forEach((color, index) => {
    const linear = color.map(srgbToLinear) as [number, number, number]
    paletteRgb.set(linear, index * 3)
    paletteLab.set(linearToOklab(linear), index * 3)
  })

  return {
    algorithm: algorithmIds[props.algorithm] ?? 1,
    brightness: props.brightness,
    chromatic: props.chromaticSplit ? 1 : 0,
    contrast: props.contrast,
    cover: props.fit === "contain" ? 0 : 1,
    dotScale: Math.min(Math.max(props.dotScale, 0.05), 1),
    levels: Math.max(2, Math.round(props.levels)),
    paletteLab,
    paletteRgb,
    paletteCount: palette.length,
    paper: parseHex(props.paperColor),
    paperOpacity: Math.min(Math.max(props.paperOpacity, 0), 1),
    pixelSize: Math.max(1, props.pixelSize),
    saturation: props.saturation,
    scale: Math.max(props.scale, 0.01),
    spread: Math.min(Math.max(props.spread, 0), 1),
  }
}

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(`Shader compile failed: ${log}`)
  }
  return shader
}

function decodeBase64(value: string) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }
  return bytes
}

/** Ordered colour dithering of an image on a WebGL2 canvas: Bayer, blue
 * or white noise thresholds, per-channel tones or an Oklab-matched
 * palette, coloured dots on transparent or coloured paper. Renders once
 * per change, not per frame. */
export function ColorDithering({
  image,
  width = "100%",
  height = "100%",
  className,
  style,
  fit = "cover",
  scale = 1,
  algorithm = "bayer-4x4",
  pixelSize = 2,
  spread = 0.5,
  levels = 4,
  colors = [],
  chromaticSplit = false,
  dotScale = 1,
  paperColor = "#000000",
  paperOpacity = 0,
  brightness = 0,
  contrast = 1,
  saturation = 1,
  onError,
}: ColorDitheringProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawRef = useRef<((uniforms: Uniforms) => void) | null>(null)
  const uniformsRef = useRef<Uniforms | null>(null)
  const onErrorRef = useRef(onError)
  useEffect(() => {
    onErrorRef.current = onError
  }, [onError])

  const paletteKey = colors.join(",")
  useEffect(() => {
    uniformsRef.current = buildUniforms({
      algorithm,
      brightness,
      chromaticSplit,
      colors: paletteKey ? paletteKey.split(",") : [],
      contrast,
      dotScale,
      fit,
      levels,
      paperColor,
      paperOpacity,
      pixelSize,
      saturation,
      scale,
      spread,
    })
    drawRef.current?.(uniformsRef.current)
  }, [
    algorithm,
    brightness,
    chromaticSplit,
    contrast,
    dotScale,
    fit,
    levels,
    paletteKey,
    paperColor,
    paperOpacity,
    pixelSize,
    saturation,
    scale,
    spread,
  ])

  useEffect(() => {
    const root = rootRef.current!
    const canvas = canvasRef.current!
    let disposed = false
    let failed = false
    let visible = false
    let dirty = true
    canvas.style.visibility = "hidden"

    function fail(cause: unknown) {
      if (disposed || failed) return
      failed = true
      canvas.style.visibility = "hidden"
      const error = cause instanceof Error ? cause : new Error(String(cause))
      console.error("Color dithering failed.", error)
      onErrorRef.current?.(error)
    }

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
      stencil: false,
    })
    if (!gl) {
      fail(new Error("WebGL2 is not available."))
      return
    }

    let program: WebGLProgram | null = null
    let imageTexture: WebGLTexture | null = null
    let noiseTexture: WebGLTexture | null = null
    let imageSize = { width: 0, height: 0 }
    let pixelRatio = 1
    const locations = new Map<string, WebGLUniformLocation | null>()

    function location(name: string) {
      if (!locations.has(name)) {
        locations.set(name, gl!.getUniformLocation(program!, name))
      }
      return locations.get(name) ?? null
    }

    function draw(uniforms: Uniforms) {
      if (
        disposed ||
        failed ||
        !program ||
        !imageTexture ||
        canvas.width === 0 ||
        canvas.height === 0
      ) {
        dirty = true
        return
      }
      if (!visible) {
        dirty = true
        return
      }
      dirty = false
      try {
        gl!.viewport(0, 0, canvas.width, canvas.height)
        gl!.useProgram(program)
        gl!.activeTexture(gl!.TEXTURE0)
        gl!.bindTexture(gl!.TEXTURE_2D, imageTexture)
        gl!.activeTexture(gl!.TEXTURE1)
        gl!.bindTexture(gl!.TEXTURE_2D, noiseTexture)
        gl!.uniform1i(location("uImage"), 0)
        gl!.uniform1i(location("uNoise"), 1)
        gl!.uniform2f(location("uCanvasSize"), canvas.width, canvas.height)
        gl!.uniform2f(location("uImageSize"), imageSize.width, imageSize.height)
        gl!.uniform1f(location("uCover"), uniforms.cover)
        gl!.uniform1f(location("uScale"), uniforms.scale)
        gl!.uniform1f(
          location("uPixelSize"),
          Math.max(1, Math.round(uniforms.pixelSize * pixelRatio))
        )
        gl!.uniform1f(location("uSpread"), uniforms.spread)
        gl!.uniform1f(location("uLevels"), uniforms.levels)
        gl!.uniform1f(location("uDotScale"), uniforms.dotScale)
        gl!.uniform1f(location("uChromatic"), uniforms.chromatic)
        gl!.uniform1f(location("uBrightness"), uniforms.brightness)
        gl!.uniform1f(location("uContrast"), uniforms.contrast)
        gl!.uniform1f(location("uSaturation"), uniforms.saturation)
        gl!.uniform1f(location("uPaperOpacity"), uniforms.paperOpacity)
        gl!.uniform3f(location("uPaper"), ...uniforms.paper)
        gl!.uniform1i(location("uAlgorithm"), uniforms.algorithm)
        gl!.uniform1i(location("uPaletteCount"), uniforms.paletteCount)
        gl!.uniform3fv(location("uPaletteLab"), uniforms.paletteLab)
        gl!.uniform3fv(location("uPaletteRgb"), uniforms.paletteRgb)
        gl!.drawArrays(gl!.TRIANGLES, 0, 3)
        canvas.style.visibility = "visible"
      } catch (error) {
        fail(error)
      }
    }

    function redraw() {
      if (uniformsRef.current) draw(uniformsRef.current)
    }

    function resize() {
      pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)
      const nextWidth = Math.round(root.clientWidth * pixelRatio)
      const nextHeight = Math.round(root.clientHeight * pixelRatio)
      if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
        canvas.width = nextWidth
        canvas.height = nextHeight
        dirty = true
      }
      if (dirty) redraw()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(root)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && dirty) redraw()
    })
    intersectionObserver.observe(root)

    function onContextLost(event: Event) {
      event.preventDefault()
      fail(new Error("The WebGL context was lost."))
    }
    canvas.addEventListener("webglcontextlost", onContextLost)

    try {
      program = gl.createProgram()!
      gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexShader))
      gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentShader))
      gl.linkProgram(program)
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(`Program link failed: ${gl.getProgramInfoLog(program)}`)
      }

      noiseTexture = gl.createTexture()
      gl.bindTexture(gl.TEXTURE_2D, noiseTexture)
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false)
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        blueNoiseSize,
        blueNoiseSize,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        decodeBase64(blueNoiseBase64)
      )
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
    } catch (error) {
      fail(error)
      return
    }

    const input = new Image()
    input.crossOrigin = "anonymous"
    input.src = image
    input
      .decode()
      .then(() => {
        if (disposed || failed) return
        imageSize = { width: input.naturalWidth, height: input.naturalHeight }
        imageTexture = gl.createTexture()
        gl.bindTexture(gl.TEXTURE_2D, imageTexture)
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, input)
        gl.generateMipmap(gl.TEXTURE_2D)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
        drawRef.current = draw
        dirty = true
        resize()
      })
      .catch(() => fail(new Error(`The image could not be loaded: ${image}`)))

    return () => {
      disposed = true
      drawRef.current = null
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      canvas.removeEventListener("webglcontextlost", onContextLost)
      if (imageTexture) gl.deleteTexture(imageTexture)
      if (noiseTexture) gl.deleteTexture(noiseTexture)
      if (program) gl.deleteProgram(program)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
    }
  }, [image])

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={className}
      style={{ width, height, overflow: "hidden", pointerEvents: "none", ...style }}
    >
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  )
}
