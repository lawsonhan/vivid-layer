"use client"

import {
  FlutedGlass as PaperFlutedGlass,
  type FlutedGlassProps as PaperFlutedGlassProps,
} from "@paper-design/shaders-react"

import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLOR_BACK = "#00000000"
const DEFAULT_COLOR_SHADOW = "#000000"
const DEFAULT_COLOR_HIGHLIGHT = "#ffffff"

export interface FlutedGlassProps extends PaperFlutedGlassProps {
  playback?: ShaderPlayback
}

export function FlutedGlass({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  image,
  colorBack = DEFAULT_COLOR_BACK,
  colorShadow = DEFAULT_COLOR_SHADOW,
  colorHighlight = DEFAULT_COLOR_HIGHLIGHT,
  className,
  style,
  ...props
}: FlutedGlassProps) {
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
      <PaperFlutedGlass
        {...props}
        width="100%"
        height="100%"
        maxPixelCount={maxPixelCount}
        image={image}
        colorBack={colorBack}
        colorShadow={colorShadow}
        colorHighlight={colorHighlight}
        speed={playbackSpeed}
      />
    </div>
  )
}
