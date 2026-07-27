"use client"

import {
  Voronoi as PaperVoronoi,
  type VoronoiProps as PaperVoronoiProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLORS = ["#ff8247", "#ffe53d"]
const DEFAULT_COLOR_GLOW = "#ffffff"
const DEFAULT_COLOR_GAP = "#2e0000"

export interface VoronoiProps extends PaperVoronoiProps {
  playback?: ShaderPlayback
}

export function Voronoi({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  colors = DEFAULT_COLORS,
  colorGlow = DEFAULT_COLOR_GLOW,
  colorGap = DEFAULT_COLOR_GAP,
  className,
  style,
  ...props
}: VoronoiProps) {
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
      <PaperVoronoi
        {...props}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
        colors={colors}
        colorGlow={colorGlow}
        colorGap={colorGap}
        speed={playbackSpeed}
      />
    </div>
  )
}
