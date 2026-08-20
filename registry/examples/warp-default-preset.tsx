// Generated from Paper Shaders 0.0.77 presets (@paper-design/shaders-react@0.0.77; Apache-2.0).
// vivid-layer Example wrapper. Preset data is licensed under Apache-2.0. Do not edit manually.

import { Warp } from "@/components/effects/warp"

export default function WarpDefaultPreset() {
  return (
    <Warp
      fit="none"
      scale={1}
      rotation={0}
      offsetX={0}
      offsetY={0}
      originX={0.5}
      originY={0.5}
      worldWidth={0}
      worldHeight={0}
      speed={1}
      frame={0}
      colors={[
        "#121212",
        "#9470ff",
        "#121212",
        "#8838ff",
      ]}
      proportion={0.45}
      softness={1}
      distortion={0.25}
      swirl={0.8}
      swirlIterations={10}
      shapeScale={0.1}
      shape="checks"
    />
  )
}
