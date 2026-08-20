"use client"

/*
 * MIT License
 *
 * Copyright (c) 2026 trickle contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Magnetize, Spin In, and Scale Slam adapt motion keyframes from:
 * https://github.com/akaieuan/trickle-UI-kit
 */

import {
  Streaming,
  type StreamingProps,
} from "@/components/ui/streaming"

export const playfulStreamingAnimations = [
  "wave",
  "spectrumTrail",
  "magnetize",
  "spinIn",
  "scaleSlam",
] as const

export type PlayfulStreamingAnimation =
  (typeof playfulStreamingAnimations)[number]

export type PlayfulStreamingProps = Omit<
  StreamingProps,
  "animation" | "animationDuration"
> & {
  animation?: PlayfulStreamingAnimation
}

export function PlayfulStreaming({
  animation = "wave",
  ...props
}: PlayfulStreamingProps) {
  return (
    <Streaming
      {...props}
      animation={animation}
      animationDuration={
        animation === "magnetize"
          ? 900
          : animation === "spinIn" || animation === "scaleSlam"
            ? 700
            : 400
      }
      data-slot="playful-streaming"
    />
  )
}
