import { ColorDithering } from "@/components/effects/color-dithering"

export default function ColorDitheringBlueNoisePreset() {
  return (
    <ColorDithering
      image="/shader-assets/monument-valley.9a0e22e4434a.jpg"
      fit="cover"
      scale={1}
      algorithm="blue-noise"
      pixelSize={1}
      spread={1}
      levels={3}
      colors={[]}
      chromaticSplit={false}
      dotScale={1}
      paperColor="#000000"
      paperOpacity={1}
      brightness={0}
      contrast={1}
      saturation={1}
    />
  )
}
