"use client"

import {
  Metaballs as PaperMetaballs,
  type MetaballsProps as PaperMetaballsProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLOR_BACK = "#000000"
const DEFAULT_COLORS = ["#6e33cc", "#ff5500", "#ffc105", "#ffc800", "#f585ff"]

export interface MetaballsProps extends PaperMetaballsProps {
  playback?: ShaderPlayback
}

export function Metaballs({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  colorBack = DEFAULT_COLOR_BACK,
  colors = DEFAULT_COLORS,
  className,
  style,
  ...props
}: MetaballsProps) {
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
      <PaperMetaballs
        {...props}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
        colorBack={colorBack}
        colors={colors}
        speed={playbackSpeed}
      />
    </div>
  )
}
