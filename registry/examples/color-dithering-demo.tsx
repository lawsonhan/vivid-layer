import { ColorDithering } from "@/components/effects/color-dithering"

export default function ColorDitheringDemo() {
  return (
    <div className="aspect-video min-h-80 w-full overflow-hidden sm:min-h-0">
      <ColorDithering image="/shader-assets/monument-valley.9a0e22e4434a.jpg" />
    </div>
  )
}
