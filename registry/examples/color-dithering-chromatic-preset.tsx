import { ColorDithering } from "@/components/effects/color-dithering"

export default function ColorDitheringChromaticPreset() {
  return (
    <ColorDithering
      image="/shader-assets/monument-valley.9a0e22e4434a.jpg"
      fit="cover"
      scale={1}
      algorithm="bayer-4x4"
      pixelSize={2}
      spread={0.3}
      levels={5}
      dotScale={0.95}
      chromaticSplit={true}
    />
  )
}
