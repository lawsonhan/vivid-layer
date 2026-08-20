"use client"

import {
  PaperTexture as PaperPaperTexture,
  type PaperTextureProps as PaperPaperTextureProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLOR_FRONT = "#9fadbc"
const DEFAULT_COLOR_BACK = "#ffffff"

export interface PaperTextureProps extends PaperPaperTextureProps {
  playback?: ShaderPlayback
}

export function PaperTexture({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  image,
  colorFront = DEFAULT_COLOR_FRONT,
  colorBack = DEFAULT_COLOR_BACK,
  className,
  style,
  ...props
}: PaperTextureProps) {
  const { rootRef, speed: playbackSpeed } = useShaderPlayback({
    playback,
    speed,
  })

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className={className}
      style={{
        width,
        height,
        pointerEvents: "none",
        ...style,
      }}
    >
      <PaperPaperTexture
        {...props}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
        image={image}
        colorFront={colorFront}
        colorBack={colorBack}
        speed={playbackSpeed}
      />
    </div>
  )
}
