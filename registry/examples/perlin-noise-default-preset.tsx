// Generated from Paper Shaders 0.0.77 presets (@paper-design/shaders-react@0.0.77; Apache-2.0).
// vivid-layer Example wrapper. Preset data is licensed under Apache-2.0. Do not edit manually.

import { PerlinNoise } from "@/components/effects/perlin-noise"

export default function PerlinNoiseDefaultPreset() {
  return (
    <PerlinNoise
      fit="none"
      scale={1}
      rotation={0}
      offsetX={0}
      offsetY={0}
      originX={0.5}
      originY={0.5}
      worldWidth={0}
      worldHeight={0}
      speed={0.5}
      frame={0}
      colorBack="#632ad5"
      colorFront="#fccff7"
      proportion={0.35}
      softness={0.1}
      octaveCount={1}
      persistence={1}
      lacunarity={1.5}
    />
  )
}
