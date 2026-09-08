import { ColorDithering } from "@/components/effects/color-dithering"

export default function ColorDitheringGameBoyPreset() {
  return (
    <ColorDithering
      image="/shader-assets/monument-valley.9a0e22e4434a.jpg"
      fit="cover"
      scale={1}
      algorithm="bayer-4x4"
      pixelSize={3}
      spread={1}
      levels={4}
      colors={["#0f380f","#306230","#8bac0f","#9bbc0f"]}
      chromaticSplit={false}
      dotScale={1}
      paperColor="#0f380f"
      paperOpacity={1}
      brightness={0}
      contrast={1.1}
      saturation={1}
    />
  )
}
