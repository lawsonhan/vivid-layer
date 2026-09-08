"use client"

import type { ShaderLabCanvasSource, ShaderLabConfig } from "@basementstudio/shader-lab"
import { useEffect, useMemo, useRef, type CSSProperties } from "react"

export interface ShaderLabImageProps {
  image: string
  width?: CSSProperties["width"]
  height?: CSSProperties["height"]
  className?: string
  style?: CSSProperties
  fit?: "cover" | "contain"
  scale?: number
  onError?: (error: Error) => void
}

interface ShaderLabImageInternalProps extends ShaderLabImageProps {
  effect: "dithering" | "halftone"
  params: Record<string, string | number | boolean>
}

const layer = {
  blendMode: "normal", compositeMode: "filter", hue: 0,
  saturation: 1, opacity: 1, visible: true,
} as const

// Uses the unmodified Shader Lab 3.0.2 runtime (Apache-2.0).
// This adapter is Vivid Layer Material; see the distribution's license notices.
export function ShaderLabImage({
  image, effect, params, fit = "cover", scale = 1,
  width = "100%", height = "100%", className, style, onError,
}: ShaderLabImageInternalProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sourceRef = useRef<ShaderLabCanvasSource | null>(null)
  const onErrorRef = useRef(onError)
  const config = useMemo<ShaderLabConfig>(() => ({
    timeline: { duration: 1, loop: false, tracks: [] },
    // Shader Lab orders layers from top to bottom: effect above image.
    layers: [
      { ...layer, id: "effect", name: "Effect", kind: "effect", type: effect, params },
      { ...layer, id: "image", name: "Image", kind: "source", type: "image",
        asset: { kind: "image", src: image },
        params: { fitMode: fit, scale, offset: [0, 0] } },
    ],
  }), [effect, image, params, fit, scale])
  const configRef = useRef(config)

  useEffect(() => {
    configRef.current = config
    sourceRef.current?.setConfig(config)
    onErrorRef.current = onError
  }, [config, onError])

  useEffect(() => {
    const root = rootRef.current!
    const canvas = canvasRef.current!
    let source: ShaderLabCanvasSource | null = null
    let disposed = false
    let failed = false
    let ready = false
    let visible = false
    let frame: number | null = null
    let size = { width: 0, height: 0 }
    canvas.style.visibility = "hidden"

    function stop() {
      if (frame !== null) cancelAnimationFrame(frame)
      frame = null
    }

    function fail(cause: unknown) {
      if (disposed || failed) return
      failed = true
      stop()
      canvas.style.visibility = "hidden"
      const error = cause instanceof Error ? cause : new Error(String(cause))
      console.error("Shader Lab image failed.", error)
      onErrorRef.current?.(error)
    }

    function draw() {
      frame = null
      try {
        source!.update(0, 0)
        frame = requestAnimationFrame(draw)
      } catch (error) {
        fail(error)
      }
    }

    function updatePlayback() {
      stop()
      if (ready && !failed && visible && !document.hidden && size.width > 0 && size.height > 0) {
        frame = requestAnimationFrame(draw)
      }
    }

    function resize() {
      // Layout dimensions stay accurate while a parent animates its transform.
      size = { width: root.clientWidth, height: root.clientHeight }
      if (size.width > 0 && size.height > 0) {
        source?.resize(size.width, size.height, Math.min(window.devicePixelRatio, 2))
      }
      updatePlayback()
    }

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(root)
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      updatePlayback()
    })
    intersectionObserver.observe(root)
    document.addEventListener("visibilitychange", updatePlayback)
    window.addEventListener("resize", resize)

    // CanvasSource does not expose asynchronous texture-load errors. Decode
    // with the same CORS policy first so a bad image reaches our error callback.
    const input = new Image()
    input.crossOrigin = "anonymous"
    input.src = image
    void Promise.all([import("@basementstudio/shader-lab"), input.decode()])
      .then(async ([{ ShaderLabCanvasSource }]) => {
        if (disposed) return
        source = new ShaderLabCanvasSource(configRef.current, { canvas })
        sourceRef.current = source
        await source.initialize()
        if (disposed) return
        ready = true
        canvas.style.visibility = "visible"
        resize()
      })
      .catch(fail)

    return () => {
      disposed = true
      stop()
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener("visibilitychange", updatePlayback)
      window.removeEventListener("resize", resize)
      source?.dispose()
      sourceRef.current = null
    }
  }, [image, effect])

  return (
    <div ref={rootRef} aria-hidden="true" className={className}
      style={{ width, height, overflow: "hidden", pointerEvents: "none", ...style }}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  )
}
