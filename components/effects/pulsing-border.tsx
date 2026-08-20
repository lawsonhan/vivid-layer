"use client"

import {
  PulsingBorder as PaperPulsingBorder,
  type PulsingBorderProps as PaperPulsingBorderProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLOR_BACK = "#000000"
const DEFAULT_COLORS = ["#0dc1fd", "#d915ef", "#ff3f2ecc"]

export interface PulsingBorderProps extends PaperPulsingBorderProps {
  playback?: ShaderPlayback
}

export function PulsingBorder({
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
}: PulsingBorderProps) {
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
      <PaperPulsingBorder
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
