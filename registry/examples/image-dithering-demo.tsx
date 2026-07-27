import { ImageDithering } from "@/components/effects/image-dithering"

export default function ImageDitheringDemo() {
  return (
    <div className="aspect-video min-h-80 w-full overflow-hidden sm:min-h-0">
      <ImageDithering image="/shader-assets/banff-landscape.18a20ae7848b.webp" />
    </div>
  )
}
