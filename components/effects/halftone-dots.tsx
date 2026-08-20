"use client"

import {
  HalftoneDots as PaperHalftoneDots,
  type HalftoneDotsProps as PaperHalftoneDotsProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLOR_FRONT = "#2b2b2b"
const DEFAULT_COLOR_BACK = "#f2f1e8"

export interface HalftoneDotsProps extends PaperHalftoneDotsProps {
  playback?: ShaderPlayback
}

export function HalftoneDots({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  image,
  colorFront = DEFAULT_COLOR_FRONT,
  colorBack = DEFAULT_COLOR_BACK,
  className,
  style,
  ...props
}: HalftoneDotsProps) {
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
      <PaperHalftoneDots
        {...props}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
        image={image}
        colorFront={colorFront}
        colorBack={colorBack}
        speed={playbackSpeed}
      />
    </div>
  )
}
