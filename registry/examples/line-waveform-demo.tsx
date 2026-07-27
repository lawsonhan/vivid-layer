"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { LineWaveform } from "@/components/ui/line-waveform"

export type LineWaveformVisualProps = {
  height: number
  barWidth: number
  barHeight: number
  barGap: number
  barRadius: number
  barColor: string
  fadeEdges: boolean
  fadeWidth: number
}

export const defaultLineWaveformVisualProps: LineWaveformVisualProps = {
  height: 80,
  barWidth: 3,
  barHeight: 4,
  barGap: 2,
  barRadius: 1.5,
  barColor: "#808080",
  fadeEdges: true,
  fadeWidth: 24,
}

type LineWaveformDemoProps = {
  waveformProps?: Partial<LineWaveformVisualProps>
}

export default function LineWaveformDemo({
  waveformProps,
}: LineWaveformDemoProps = {}) {
  const [active, setActive] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [mode, setMode] = useState<"static" | "scrolling">("static")
  const visualProps = {
    ...defaultLineWaveformVisualProps,
    ...waveformProps,
  }

  const handleToggleActive = () => {
    setActive(!active)
    if (!active) {
      setProcessing(false)
    }
  }

  const handleToggleProcessing = () => {
    setProcessing(!processing)
    if (!processing) {
      setActive(false)
    }
  }

  return (
    <div className="flex h-[25rem] w-full items-center justify-center p-10">
      <div className="w-full rounded-lg border bg-card p-6">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Live Audio Waveform</h3>
          <p className="text-sm text-muted-foreground">
            Real-time microphone input visualization with audio reactivity
          </p>
        </div>

        <div className="grid grid-rows-[10rem_auto] gap-4">
          <LineWaveform
            {...visualProps}
            className="self-center"
            active={active}
            processing={processing}
            mode={mode}
            historySize={120}
          />

          <div className="flex flex-wrap justify-center gap-2">
            <Button
              size="sm"
              variant={active ? "default" : "outline"}
              onClick={handleToggleActive}
            >
              {active ? "Stop" : "Start"} Listening
            </Button>
            <Button
              size="sm"
              variant={processing ? "default" : "outline"}
              onClick={handleToggleProcessing}
            >
              {processing ? "Stop" : "Start"} Processing
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                setMode(mode === "static" ? "scrolling" : "static")
              }
            >
              Mode: {mode === "static" ? "Static" : "Scrolling"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
