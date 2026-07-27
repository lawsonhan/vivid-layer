"use client"

import {
  GodRays as PaperGodRays,
  type GodRaysProps as PaperGodRaysProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLOR_BACK = "#000000"
const DEFAULT_COLOR_BLOOM = "#0000ff"
const DEFAULT_COLORS = ["#a600ff6e", "#6200fff0", "#ffffff", "#33fff5"]

export interface GodRaysProps extends PaperGodRaysProps {
  playback?: ShaderPlayback
}

export function GodRays({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  colorBack = DEFAULT_COLOR_BACK,
  colorBloom = DEFAULT_COLOR_BLOOM,
  colors = DEFAULT_COLORS,
  className,
  style,
  ...props
}: GodRaysProps) {
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
      <PaperGodRays
        {...props}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
        colorBack={colorBack}
        colorBloom={colorBloom}
        colors={colors}
        speed={playbackSpeed}
      />
    </div>
  )
}
