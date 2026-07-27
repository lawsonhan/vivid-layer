"use client"

import {
  Heatmap as PaperHeatmap,
  type HeatmapProps as PaperHeatmapProps,
} from "@paper-design/shaders-react"

import { ShaderLoadBoundary } from "@/components/effects/shader-load-boundary"
import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLOR_BACK = "#000000"
const DEFAULT_COLORS = [
  "#11206a",
  "#1f3ba2",
  "#2f63e7",
  "#6bd7ff",
  "#ffe679",
  "#ff991e",
  "#ff4c00",
]

export interface HeatmapProps extends PaperHeatmapProps {
  playback?: ShaderPlayback
}

export function Heatmap({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  image,
  suspendWhenProcessingImage = true,
  colorBack = DEFAULT_COLOR_BACK,
  colors = DEFAULT_COLORS,
  className,
  style,
  ...props
}: HeatmapProps) {
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
      <ShaderLoadBoundary
        key={typeof image === "string" ? image : image.currentSrc || image.src}
      >
        <PaperHeatmap
          {...props}
          width="100%"
          height="100%"
          maxPixelCount={maxPixelCount}
          image={image}
          suspendWhenProcessingImage={suspendWhenProcessingImage}
          colorBack={colorBack}
          colors={colors}
          speed={playbackSpeed}
        />
      </ShaderLoadBoundary>
    </div>
  )
}
