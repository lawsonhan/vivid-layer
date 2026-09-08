import { PrintHalftone } from "@/components/effects/print-halftone"

export default function PrintHalftoneProcessPreset() {
  return (
    <PrintHalftone
      image="/shader-assets/monument-valley.9a0e22e4434a.jpg"
      fit="cover"
      scale={1}
      shape="circle"
      spacing={5}
      dotSize={1}
      contrast={1}
      softness={0.25}
      dotGain={0}
      gcr={0.5}
      cmykBlend="subtractive"
      cyanAngle={15}
      magentaAngle={75}
      yellowAngle={0}
      keyAngle={45}
      inkCyan="#00AEEF"
      inkMagenta="#EC008C"
      inkYellow="#FFF200"
      inkKey="#1a1a1a"
      paperColor="#F5F5F0"
      paperGrain={0.15}
      registration={0}
    />
  )
}
