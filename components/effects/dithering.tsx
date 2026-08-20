"use client"

import {
  Dithering as PaperDithering,
  type DitheringProps as PaperDitheringProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLOR_BACK = "#000000"
const DEFAULT_COLOR_FRONT = "#00b2ff"

export interface DitheringProps extends PaperDitheringProps {
  playback?: ShaderPlayback
}

export function Dithering({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  colorBack = DEFAULT_COLOR_BACK,
  colorFront = DEFAULT_COLOR_FRONT,
  className,
  style,
  ...props
}: DitheringProps) {
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
      <PaperDithering
        {...props}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
        colorBack={colorBack}
        colorFront={colorFront}
        speed={playbackSpeed}
      />
    </div>
  )
}
