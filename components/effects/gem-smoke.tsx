"use client"

import {
  GemSmoke as PaperGemSmoke,
  type GemSmokeProps as PaperGemSmokeProps,
} from "@paper-design/shaders-react"

import { ShaderLoadBoundary } from "@/components/effects/shader-load-boundary"
import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLOR_BACK = "#f0efea"
const DEFAULT_COLOR_INNER = "#fafaf5"
const DEFAULT_COLORS = ["#333333", "#e7e6df"]

export interface GemSmokeProps extends PaperGemSmokeProps {
  playback?: ShaderPlayback
}

export function GemSmoke({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  image,
  suspendWhenProcessingImage = true,
  colors = DEFAULT_COLORS,
  colorInner = DEFAULT_COLOR_INNER,
  colorBack = DEFAULT_COLOR_BACK,
  className,
  style,
  ...props
}: GemSmokeProps) {
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
        key={
          typeof image === "string" ? image : image?.currentSrc || image?.src
        }
      >
        <PaperGemSmoke
          {...props}
          width="100%"
          height="100%"
          maxPixelCount={maxPixelCount}
          image={image}
          suspendWhenProcessingImage={suspendWhenProcessingImage}
          colors={colors}
          colorInner={colorInner}
          colorBack={colorBack}
          speed={playbackSpeed}
        />
      </ShaderLoadBoundary>
    </div>
  )
}
