import { ColorDithering } from "@/components/effects/color-dithering"

export default function ColorDitheringClassicPreset() {
  return (
    <ColorDithering
      image="/shader-assets/monument-valley.9a0e22e4434a.jpg"
      fit="cover"
      scale={1}
      algorithm="bayer-4x4"
      pixelSize={1}
      spread={0.5}
      levels={4}
      dotScale={1}
      chromaticSplit={false}
    />
  )
}
