"use client"

import {
  NeuroNoise as PaperNeuroNoise,
  type NeuroNoiseProps as PaperNeuroNoiseProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_SPEED = 0.2
const DEFAULT_COLOR_FRONT = "#b8f3ff"
const DEFAULT_COLOR_MID = "#7357ff"
const DEFAULT_COLOR_BACK = "#09081a"

export interface NeuroNoiseProps extends PaperNeuroNoiseProps {
  playback?: ShaderPlayback
}

export function NeuroNoise({
  playback = "auto",
  speed = DEFAULT_SPEED,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  colorFront = DEFAULT_COLOR_FRONT,
  colorMid = DEFAULT_COLOR_MID,
  colorBack = DEFAULT_COLOR_BACK,
  brightness = 0.08,
  contrast = 0.45,
  scale = 0.85,
  className,
  style,
  ...props
}: NeuroNoiseProps) {
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
      <PaperNeuroNoise
        {...props}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
        colorFront={colorFront}
        colorMid={colorMid}
        colorBack={colorBack}
        brightness={brightness}
        contrast={contrast}
        scale={scale}
        speed={playbackSpeed}
      />
    </div>
  )
}
