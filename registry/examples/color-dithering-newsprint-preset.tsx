import { ColorDithering } from "@/components/effects/color-dithering"

export default function ColorDitheringNewsprintPreset() {
  return (
    <ColorDithering
      image="/shader-assets/monument-valley.9a0e22e4434a.jpg"
      fit="cover"
      scale={1}
      algorithm="bayer-4x4"
      pixelSize={2}
      spread={0.9}
      levels={5}
      colors={[]}
      chromaticSplit={true}
      dotScale={0.75}
      paperColor="#8c8784"
      paperOpacity={1}
      brightness={0.02}
      contrast={0.95}
      saturation={1}
    />
  )
}
