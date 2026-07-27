"use client"

import {
  Spiral as PaperSpiral,
  type SpiralProps as PaperSpiralProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLOR_BACK = "#001429"
const DEFAULT_COLOR_FRONT = "#79D1FF"

export interface SpiralProps extends PaperSpiralProps {
  playback?: ShaderPlayback
}

export function Spiral({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  colorBack = DEFAULT_COLOR_BACK,
  colorFront = DEFAULT_COLOR_FRONT,
  className,
  style,
  ...props
}: SpiralProps) {
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
      <PaperSpiral
        {...props}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
        colorBack={colorBack}
        colorFront={colorFront}
        speed={playbackSpeed}
      />
    </div>
  )
}
