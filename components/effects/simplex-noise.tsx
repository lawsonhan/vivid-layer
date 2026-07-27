"use client"

import {
  SimplexNoise as PaperSimplexNoise,
  type SimplexNoiseProps as PaperSimplexNoiseProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLORS = ["#4449CF", "#FFD1E0", "#F94446", "#FFD36B", "#FFFFFF"]

export interface SimplexNoiseProps extends PaperSimplexNoiseProps {
  playback?: ShaderPlayback
}

export function SimplexNoise({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  colors = DEFAULT_COLORS,
  className,
  style,
  ...props
}: SimplexNoiseProps) {
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
      <PaperSimplexNoise
        {...props}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
        colors={colors}
        speed={playbackSpeed}
      />
    </div>
  )
}
