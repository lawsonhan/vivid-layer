"use client"

import { useMemo } from "react"
import { ShaderLabImage, type ShaderLabImageProps } from "@/components/effects/shader-lab-image"

export interface PrintHalftoneProps extends ShaderLabImageProps {
  shape?: "circle" | "square" | "diamond" | "line"
  spacing?: number
  dotSize?: number
  contrast?: number
  softness?: number
  dotGain?: number
  gcr?: number
  cmykBlend?: "subtractive" | "overprint"
  cyanAngle?: number
  magentaAngle?: number
  yellowAngle?: number
  keyAngle?: number
  inkCyan?: string
  inkMagenta?: string
  inkYellow?: string
  inkKey?: string
  paperColor?: string
  paperGrain?: number
  registration?: number
}

export function PrintHalftone({
  shape = "circle", spacing = 5, dotSize = 1, contrast = 1,
  softness = 0.25, dotGain = 0, gcr = 0.5, cmykBlend = "subtractive",
  cyanAngle = 15, magentaAngle = 75, yellowAngle = 0, keyAngle = 45,
  inkCyan = "#00AEEF", inkMagenta = "#EC008C", inkYellow = "#FFF200", inkKey = "#1a1a1a",
  paperColor = "#F5F5F0", paperGrain = 0.15, registration = 0, ...props
}: PrintHalftoneProps) {
  const params = useMemo(() => ({
    colorMode: "cmyk", preset: "process", dotMin: 0, dotMorph: 0,
    shape, spacing, dotSize, contrast, softness, dotGain, gcr, cmykBlend,
    cyanAngle, magentaAngle, yellowAngle, keyAngle,
    inkCyan, inkMagenta, inkYellow, inkKey, paperColor, paperGrain, registration,
  }), [shape, spacing, dotSize, contrast, softness, dotGain, gcr, cmykBlend,
    cyanAngle, magentaAngle, yellowAngle, keyAngle,
    inkCyan, inkMagenta, inkYellow, inkKey, paperColor, paperGrain, registration])
  return <ShaderLabImage {...props} effect="halftone" params={params} />
}
