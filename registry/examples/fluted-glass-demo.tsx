import { FlutedGlass } from "@/components/effects/fluted-glass"

export default function FlutedGlassDemo() {
  return (
    <div className="aspect-video min-h-80 w-full overflow-hidden sm:min-h-0">
      <FlutedGlass image="/shader-assets/banff-landscape.18a20ae7848b.webp" />
    </div>
  )
}
