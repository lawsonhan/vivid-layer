import { SimplexNoise } from "@/components/effects/simplex-noise"

export default function SimplexNoiseDemo() {
  return (
    <div className="aspect-video min-h-80 w-full overflow-hidden sm:min-h-0">
      <SimplexNoise />
    </div>
  )
}
