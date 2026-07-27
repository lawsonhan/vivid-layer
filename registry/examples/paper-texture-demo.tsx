import { PaperTexture } from "@/components/effects/paper-texture"

export default function PaperTextureDemo() {
  return (
    <div className="aspect-video min-h-80 w-full overflow-hidden sm:min-h-0">
      <PaperTexture image="/shader-assets/banff-landscape.18a20ae7848b.webp" />
    </div>
  )
}
