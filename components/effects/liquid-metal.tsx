"use client"

import {
  LiquidMetal as PaperLiquidMetal,
  type LiquidMetalProps as PaperLiquidMetalProps,
} from "@paper-design/shaders-react"

import { ShaderLoadBoundary } from "@/components/effects/shader-load-boundary"
import {
  useShaderPlayback,
  type ShaderPlayback,
} from "@/hooks/use-shader-playback"

const DEFAULT_MAX_PIXEL_COUNT = 2_073_600
const DEFAULT_COLOR_BACK = "#AAAAAC"
const DEFAULT_COLOR_TINT = "#ffffff"

export interface LiquidMetalProps extends PaperLiquidMetalProps {
  playback?: ShaderPlayback
}

export function LiquidMetal({
  playback = "auto",
  speed,
  width = "100%",
  height = "100%",
  maxPixelCount = DEFAULT_MAX_PIXEL_COUNT,
  image,
  suspendWhenProcessingImage = true,
  colorBack = DEFAULT_COLOR_BACK,
  colorTint = DEFAULT_COLOR_TINT,
  className,
  style,
  ...props
}: LiquidMetalProps) {
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
        <PaperLiquidMetal
          {...props}
          width="100%"
          height="100%"
          maxPixelCount={maxPixelCount}
          image={image}
          suspendWhenProcessingImage={suspendWhenProcessingImage}
          colorBack={colorBack}
          colorTint={colorTint}
          speed={playbackSpeed}
        />
      </ShaderLoadBoundary>
    </div>
  )
}
