"use client"

import {
  Water as PaperWater,
  type WaterProps as PaperWaterProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLOR_BACK = "#909090"
const DEFAULT_COLOR_HIGHLIGHT = "#ffffff"

export interface WaterProps extends PaperWaterProps {
  playback?: ShaderPlayback
}

export function Water({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  image,
  colorBack = DEFAULT_COLOR_BACK,
  colorHighlight = DEFAULT_COLOR_HIGHLIGHT,
  className,
  style,
  ...props
}: WaterProps) {
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
      <PaperWater
        {...props}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
        image={image}
        colorBack={colorBack}
        colorHighlight={colorHighlight}
        speed={playbackSpeed}
      />
    </div>
  )
}
