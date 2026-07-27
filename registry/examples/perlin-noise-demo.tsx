import { PerlinNoise } from "@/components/effects/perlin-noise"

export default function PerlinNoiseDemo() {
  return (
    <div className="aspect-video min-h-80 w-full overflow-hidden sm:min-h-0">
      <PerlinNoise />
    </div>
  )
}
