"use client"

import { useMemo } from "react"
import { ShaderLabImage, type ShaderLabImageProps } from "@/components/effects/shader-lab-image"

export interface ColorDitheringProps extends ShaderLabImageProps {
  algorithm?: "bayer-2x2" | "bayer-4x4" | "bayer-8x8" | "noise"
  pixelSize?: number
  spread?: number
  levels?: number
  dotScale?: number
  chromaticSplit?: boolean
}

export function ColorDithering({
  algorithm = "bayer-4x4", pixelSize = 2, spread = 0.3,
  levels = 5, dotScale = 0.95, chromaticSplit = true, ...props
}: ColorDitheringProps) {
  const params = useMemo(() => ({
    colorMode: "source", animateDither: false,
    algorithm, pixelSize, spread, levels, dotScale, chromaticSplit,
  }), [algorithm, pixelSize, spread, levels, dotScale, chromaticSplit])
  return <ShaderLabImage {...props} effect="dithering" params={params} />
}
