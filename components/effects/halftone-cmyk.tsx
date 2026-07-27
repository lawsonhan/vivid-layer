"use client"

import {
  HalftoneCmyk as PaperHalftoneCmyk,
  type HalftoneCmykProps as PaperHalftoneCmykProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLOR_BACK = "#fbfaf5"
const DEFAULT_COLOR_C = "#00b4ff"
const DEFAULT_COLOR_M = "#fc519f"
const DEFAULT_COLOR_Y = "#ffd800"
const DEFAULT_COLOR_K = "#231f20"

export interface HalftoneCmykProps extends PaperHalftoneCmykProps {
  playback?: ShaderPlayback
}

export function HalftoneCmyk({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  image,
  colorBack = DEFAULT_COLOR_BACK,
  colorC = DEFAULT_COLOR_C,
  colorM = DEFAULT_COLOR_M,
  colorY = DEFAULT_COLOR_Y,
  colorK = DEFAULT_COLOR_K,
  className,
  style,
  ...props
}: HalftoneCmykProps) {
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
      <PaperHalftoneCmyk
        {...props}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
        image={image}
        colorBack={colorBack}
        colorC={colorC}
        colorM={colorM}
        colorY={colorY}
        colorK={colorK}
        speed={playbackSpeed}
      />
    </div>
  )
}
