import { ColorDithering } from "@/components/effects/color-dithering"

export default function ColorDitheringRisographPreset() {
  return (
    <ColorDithering
      image="/shader-assets/monument-valley.9a0e22e4434a.jpg"
      fit="cover"
      scale={1}
      algorithm="blue-noise"
      pixelSize={2}
      spread={1}
      levels={4}
      colors={["#f4efe4","#ff48b0","#0078bf","#2b1f3a"]}
      chromaticSplit={false}
      dotScale={1}
      paperColor="#f4efe4"
      paperOpacity={1}
      brightness={0.05}
      contrast={1.1}
      saturation={1}
    />
  )
}
