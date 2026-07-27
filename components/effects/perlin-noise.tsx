"use client"

import {
  PerlinNoise as PaperPerlinNoise,
  type PerlinNoiseProps as PaperPerlinNoiseProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLOR_FRONT = "#fccff7"
const DEFAULT_COLOR_BACK = "#632ad5"

export interface PerlinNoiseProps extends PaperPerlinNoiseProps {
  playback?: ShaderPlayback
}

export function PerlinNoise({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  colorFront = DEFAULT_COLOR_FRONT,
  colorBack = DEFAULT_COLOR_BACK,
  className,
  style,
  ...props
}: PerlinNoiseProps) {
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
      <PaperPerlinNoise
        {...props}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
        colorFront={colorFront}
        colorBack={colorBack}
        speed={playbackSpeed}
      />
    </div>
  )
}
