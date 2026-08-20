import { HalftoneDots } from "@/components/effects/halftone-dots"

export default function HalftoneDotsDemo() {
  return (
    <div className="aspect-video min-h-80 w-full overflow-hidden sm:min-h-0">
      <HalftoneDots image="/shader-assets/banff-landscape.18a20ae7848b.webp" />
    </div>
  )
}
