"use client"

import {
  ImageDithering as PaperImageDithering,
  type ImageDitheringProps as PaperImageDitheringProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLOR_FRONT = "#94ffaf"
const DEFAULT_COLOR_BACK = "#000c38"
const DEFAULT_COLOR_HIGHLIGHT = "#eaff94"

export interface ImageDitheringProps extends PaperImageDitheringProps {
  playback?: ShaderPlayback
}

export function ImageDithering({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  image,
  colorFront = DEFAULT_COLOR_FRONT,
  colorBack = DEFAULT_COLOR_BACK,
  colorHighlight = DEFAULT_COLOR_HIGHLIGHT,
  className,
  style,
  ...props
}: ImageDitheringProps) {
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
      <PaperImageDithering
        {...props}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
        image={image}
        colorFront={colorFront}
        colorBack={colorBack}
        colorHighlight={colorHighlight}
        speed={playbackSpeed}
      />
    </div>
  )
}
