"use client"

import {
  StaticRadialGradient as PaperStaticRadialGradient,
  type StaticRadialGradientProps as PaperStaticRadialGradientProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLOR_BACK = "#000000"
const DEFAULT_COLORS = ["#00bbff", "#00ffe1", "#ffffff"]

export interface StaticRadialGradientProps
  extends PaperStaticRadialGradientProps {
  playback?: ShaderPlayback
}

export function StaticRadialGradient({
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
}: StaticRadialGradientProps) {
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
      <PaperStaticRadialGradient
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
