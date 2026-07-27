"use client"

import {
  GrainGradient as PaperGrainGradient,
  type GrainGradientProps as PaperGrainGradientProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_SPEED = 0.18
const DEFAULT_COLOR_BACK = "#1e0c0a"
const DEFAULT_COLORS = ["#ff6b35", "#f7c948", "#ff8fab", "#7c3aed"]

export interface GrainGradientProps extends PaperGrainGradientProps {
  playback?: ShaderPlayback
}

export function GrainGradient({
  playback = "auto",
  speed = DEFAULT_SPEED,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  colorBack = DEFAULT_COLOR_BACK,
  colors = DEFAULT_COLORS,
  shape = "blob",
  softness = 0.7,
  intensity = 0.35,
  noise = 0.45,
  scale = 1.15,
  className,
  style,
  ...props
}: GrainGradientProps) {
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
      <PaperGrainGradient
        {...props}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
        colorBack={colorBack}
        colors={colors}
        shape={shape}
        softness={softness}
        intensity={intensity}
        noise={noise}
        scale={scale}
        speed={playbackSpeed}
      />
    </div>
  )
}
