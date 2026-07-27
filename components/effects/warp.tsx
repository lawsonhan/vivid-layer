"use client"

import {
  Warp as PaperWarp,
  type WarpProps as PaperWarpProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLORS = ["#121212", "#9470ff", "#121212", "#8838ff"]

export interface WarpProps extends PaperWarpProps {
  playback?: ShaderPlayback
}

export function Warp({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  colors = DEFAULT_COLORS,
  className,
  style,
  ...props
}: WarpProps) {
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
      <PaperWarp
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
