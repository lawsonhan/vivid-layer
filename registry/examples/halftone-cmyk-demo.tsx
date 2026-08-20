import { HalftoneCmyk } from "@/components/effects/halftone-cmyk"

export default function HalftoneCmykDemo() {
  return (
    <div className="aspect-video min-h-80 w-full overflow-hidden sm:min-h-0">
      <HalftoneCmyk image="/shader-assets/banff-landscape.18a20ae7848b.webp" />
    </div>
  )
}
