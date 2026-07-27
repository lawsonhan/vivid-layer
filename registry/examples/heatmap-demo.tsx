import { Heatmap } from "@/components/effects/heatmap"

export default function HeatmapDemo() {
  return (
    <div className="aspect-video min-h-80 w-full overflow-hidden sm:min-h-0">
      <Heatmap image="/shader-assets/vivid-layer-mark.ddc756a6ca4b.png" />
    </div>
  )
}
