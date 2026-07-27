"use client"

import {
  MeshGradient as PaperMeshGradient,
  type MeshGradientProps as PaperMeshGradientProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_SPEED = 0.12
const DEFAULT_COLORS = ["#dff8ff", "#58d5c9", "#2f8cff", "#c4f1e6"]

export interface MeshGradientProps extends PaperMeshGradientProps {
  playback?: ShaderPlayback
}

export function MeshGradient({
  playback = "auto",
  speed = DEFAULT_SPEED,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  colors = DEFAULT_COLORS,
  distortion = 0.75,
  swirl = 0.35,
  grainMixer = 0.08,
  grainOverlay = 0.04,
  className,
  style,
  ...props
}: MeshGradientProps) {
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
      <PaperMeshGradient
        {...props}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
        colors={colors}
        distortion={distortion}
        swirl={swirl}
        grainMixer={grainMixer}
        grainOverlay={grainOverlay}
        speed={playbackSpeed}
      />
    </div>
  )
}
