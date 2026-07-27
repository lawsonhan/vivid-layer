import { GemSmoke } from "@/components/effects/gem-smoke"

export default function GemSmokeDemo() {
  return (
    <div className="aspect-video min-h-80 w-full overflow-hidden sm:min-h-0">
      <GemSmoke image="/shader-assets/vivid-layer-mark.ddc756a6ca4b.png" />
    </div>
  )
}
