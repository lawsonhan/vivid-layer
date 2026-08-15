"use client"

import { useState } from "react"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { VoiceComposer } from "@/components/ui/voice-composer"

type WaveformMode = "static" | "scrolling"

function VoiceModeHint() {
  return (
    <div
      className="pointer-events-none relative h-20 max-w-60 text-muted-foreground/60"
      data-slot="voice-composer-demo-hint"
    >
      <svg
        aria-hidden="true"
        className="absolute -top-4 left-0 h-16 w-28"
        fill="none"
        viewBox="0 0 160 96"
      >
        <path
          d="M150 82 C122 81 95 65 79 46 C68 33 68 21 77 19 C87 17 94 28 89 37 C82 49 64 47 56 38 C49 30 44 22 40 14"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
        <path
          d="M40 14 Q50 17 58 24 M40 14 Q39 26 42 35"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="3"
        />
      </svg>
      <p className="absolute top-6 left-28 whitespace-nowrap text-lg font-normal leading-none">
        Try me!
      </p>
    </div>
  )
}

export default function VoiceComposerDemo() {
  const [draft, setDraft] = useState("")
  const [waveformMode, setWaveformMode] = useState<WaveformMode>("scrolling")

  const handleWaveformModeChange = (values: string[]) => {
    const [nextMode] = values

    if (nextMode === "static" || nextMode === "scrolling") {
      setWaveformMode(nextMode)
    }
  }

  return (
    <div className="flex min-h-[28rem] w-full items-center justify-center p-4 sm:p-6">
      <div className="flex w-full max-w-2xl flex-col gap-4">
        <VoiceComposer
          aria-label="Message composer"
          onSubmit={() => setDraft("")}
          onValueChange={setDraft}
          value={draft}
          waveformMode={waveformMode}
        />

        <div className="grid min-h-20 grid-cols-1 items-start gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <VoiceModeHint />

          <div className="flex flex-wrap items-center justify-center gap-3 sm:col-start-2">
            <span
              className="text-sm text-muted-foreground"
              id="voice-composer-waveform-mode"
            >
              Waveform
            </span>
            <ToggleGroup
              aria-labelledby="voice-composer-waveform-mode"
              onValueChange={handleWaveformModeChange}
              size="sm"
              value={[waveformMode]}
              variant="outline"
            >
              <ToggleGroupItem value="static">Static</ToggleGroupItem>
              <ToggleGroupItem value="scrolling">Scrolling</ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </div>
    </div>
  )
}
