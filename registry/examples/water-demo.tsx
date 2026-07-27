import { Water } from "@/components/effects/water"

export default function WaterDemo() {
  return (
    <div className="aspect-video min-h-80 w-full overflow-hidden sm:min-h-0">
      <Water image="/shader-assets/banff-landscape.18a20ae7848b.webp" />
    </div>
  )
}
