// Generated from Paper Shaders 0.0.77 presets (@paper-design/shaders-react@0.0.77; Apache-2.0).
// vivid-layer Example wrapper. Preset data is licensed under Apache-2.0. Do not edit manually.

import { Warp } from "@/components/effects/warp"

export default function WarpLiveInkPreset() {
  return (
    <Warp
      fit="none"
      scale={1.2}
      rotation={44}
      offsetX={0}
      offsetY={-0.3}
      originX={0.5}
      originY={0.5}
      worldWidth={0}
      worldHeight={0}
      speed={2.5}
      frame={0}
      colors={[
        "#111314",
        "#9faeab",
        "#f3fee7",
        "#f3fee7",
      ]}
      proportion={0.05}
      softness={0}
      distortion={0.25}
      swirl={0.8}
      swirlIterations={10}
      shapeScale={0.28}
      shape="checks"
    />
  )
}
