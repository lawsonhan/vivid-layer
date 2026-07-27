"use client"

import {
  StaticMeshGradient as PaperStaticMeshGradient,
  type StaticMeshGradientProps as PaperStaticMeshGradientProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLORS = ["#ffad0a", "#6200ff", "#e2a3ff", "#ff99fd"]

export interface StaticMeshGradientProps
  extends PaperStaticMeshGradientProps {
  playback?: ShaderPlayback
}

export function StaticMeshGradient({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  colors = DEFAULT_COLORS,
  className,
  style,
  ...props
}: StaticMeshGradientProps) {
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
      <PaperStaticMeshGradient
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
