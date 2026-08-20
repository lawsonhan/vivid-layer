"use client"

import {
  startTransition,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ComponentProps,
} from "react"
import { cjk } from "@streamdown/cjk"
import {
  Streamdown,
  type AnimateOptions,
  type Components,
  type ExtraProps,
} from "streamdown"

import { cn } from "@/lib/utils"

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

const streamingPlugins = { cjk }

type StreamdownSpanProps = ComponentProps<"span"> & ExtraProps

function AnimatedGlyphSpan({
  children,
  node: _node,
  ...props
}: StreamdownSpanProps) {
  const glyph =
    "data-sd-animate" in props && typeof children === "string"
      ? children
      : undefined

  if (glyph === undefined) {
    return <span {...props}>{children}</span>
  }

  return (
    <span {...props} data-sd-glyph={glyph}>
      <span data-sd-layout="">{children}</span>
    </span>
  )
}

const animatedGlyphComponents = {
  span: AnimatedGlyphSpan,
} satisfies Components

export const streamingAnimations = [
  "fadeIn",
  "blurIn",
  "slideUp",
  "slideLeft",
  "foldIn",
] as const

export type StreamingAnimation =
  | (typeof streamingAnimations)[number]
  | (string & {})

const DEFAULT_ANIMATION_DURATION = 400

const streamingAnimationSettings = {
  easing: "ease",
  sep: "char",
  stagger: 0,
} satisfies Omit<AnimateOptions, "animation">

// The reveal rate is proportional to the backlog, so the display trails the
// newest arrival by about one horizon and never falls further behind.
const STREAMING_HORIZON_MS = 320
const DRAIN_HORIZON_MS = 160
const MAX_FRAME_MS = 100
const MAGNETIZE_REVEAL_CADENCE_MS = 60
const SCALE_SLAM_REVEAL_CADENCE_MS = 50

const graphemeSegmenter =
  typeof Intl !== "undefined" && "Segmenter" in Intl
    ? new Intl.Segmenter(undefined, { granularity: "grapheme" })
    : null

function advanceGraphemes(
  text: string,
  from: number,
  count: number,
) {
  const pending = text.slice(from)

  if (graphemeSegmenter) {
    let taken = 0
    for (const segment of graphemeSegmenter.segment(pending)) {
      if (taken === count) return from + segment.index
      taken += 1
    }
    return text.length
  }

  let offset = 0
  let taken = 0
  while (taken < count && offset < pending.length) {
    const codePoint = pending.codePointAt(offset)
    offset += codePoint !== undefined && codePoint > 0xffff ? 2 : 1
    taken += 1
  }
  return from + offset
}

export function smoothReveal(
  displayed: string,
  target: string,
  elapsedMs: number,
  isStreaming: boolean,
) {
  if (!target.startsWith(displayed)) return target

  const backlog = target.length - displayed.length
  if (backlog === 0) return displayed

  const horizon = isStreaming
    ? STREAMING_HORIZON_MS
    : DRAIN_HORIZON_MS
  const elapsed = Math.min(Math.max(elapsedMs, 0), MAX_FRAME_MS)
  const budget = Math.max(
    1,
    Math.round((backlog * elapsed) / horizon),
  )

  return target.slice(
    0,
    advanceGraphemes(target, displayed.length, budget),
  )
}

function useSmoothText(
  target: string,
  isStreaming: boolean,
  enabled: boolean,
  cadenceMs = 0,
) {
  const [displayed, setDisplayed] = useState(target)
  const displayedRef = useRef(displayed)
  const nextCadenceAtRef = useRef<number | null>(null)

  useEffect(() => {
    if (!enabled || !target.startsWith(displayedRef.current)) {
      nextCadenceAtRef.current = null
      displayedRef.current = target
      startTransition(() => setDisplayed(target))
      return
    }

    if (cadenceMs > 0) {
      if (displayedRef.current === target) return

      let timer: ReturnType<typeof setTimeout> | null = null

      function scheduleCadenceTick() {
        const now = performance.now()
        const deadline = nextCadenceAtRef.current ?? now

        timer = setTimeout(
          runCadenceTick,
          Math.max(0, deadline - now),
        )
      }

      function runCadenceTick() {
        const current = displayedRef.current

        if (!target.startsWith(current)) {
          nextCadenceAtRef.current = null
          displayedRef.current = target
          setDisplayed(target)
          return
        }

        if (current === target) return

        const next = target.slice(
          0,
          advanceGraphemes(target, current.length, 1),
        )

        displayedRef.current = next
        setDisplayed(next)
        nextCadenceAtRef.current =
          performance.now() + cadenceMs

        if (next !== target) {
          scheduleCadenceTick()
        }
      }

      scheduleCadenceTick()
      return () => {
        if (timer !== null) clearTimeout(timer)
      }
    }

    nextCadenceAtRef.current = null

    if (displayedRef.current === target) return

    let frame = 0
    let last = performance.now()

    function tick(now: number) {
      const next = smoothReveal(
        displayedRef.current,
        target,
        now - last,
        isStreaming,
      )
      last = now

      if (next !== displayedRef.current) {
        displayedRef.current = next
        startTransition(() => setDisplayed(next))
      }

      if (next.length < target.length) {
        frame = requestAnimationFrame(tick)
      }
    }

    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [cadenceMs, enabled, isStreaming, target])

  return enabled && target.startsWith(displayed)
    ? displayed
    : target
}

// Streamdown drops the animation spans the moment isAnimating turns false,
// so hold it through one more animation duration to let the last fade finish.
function useAnimationLinger(active: boolean, duration: number) {
  const [lingering, setLingering] = useState(active)

  useEffect(() => {
    if (active) {
      const frame = requestAnimationFrame(
        () => setLingering(true),
      )

      return () => cancelAnimationFrame(frame)
    }

    const timer = setTimeout(
      () => setLingering(false),
      duration,
    )

    return () => clearTimeout(timer)
  }, [active, duration])

  return lingering
}

export type StreamingProps = Omit<
  ComponentProps<"div">,
  "children"
> & {
  animation?: StreamingAnimation
  animationDuration?: number
  children: string
  isStreaming?: boolean
}

function getReducedMotionPreference() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia(REDUCED_MOTION_QUERY).matches
  )
}

function subscribeToReducedMotion(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined

  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)
  mediaQuery.addEventListener("change", onStoreChange)

  return () => mediaQuery.removeEventListener("change", onStoreChange)
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionPreference,
    () => false,
  )
}

function resolveDirection(direction: ComponentProps<"div">["dir"]) {
  return direction === "ltr" || direction === "rtl"
    ? direction
    : "auto"
}

export function Streaming({
  animation = "fadeIn",
  animationDuration = DEFAULT_ANIMATION_DURATION,
  children,
  className,
  dir,
  isStreaming = false,
  "aria-busy": ariaBusy,
  ...props
}: StreamingProps) {
  const shouldReduceMotion = useReducedMotion()
  const text = useSmoothText(
    children,
    isStreaming,
    !shouldReduceMotion,
    animation === "magnetize"
      ? MAGNETIZE_REVEAL_CADENCE_MS
      : animation === "scaleSlam"
        ? SCALE_SLAM_REVEAL_CADENCE_MS
        : 0,
  )
  const isActive = isStreaming || text !== children
  const isLingering = useAnimationLinger(
    isActive,
    animationDuration,
  )
  const shouldAnimate =
    !shouldReduceMotion && (isActive || isLingering)

  return (
    <div
      aria-busy={ariaBusy ?? isActive}
      className={cn("min-w-0", className)}
      data-sd-animation={animation}
      data-slot="streaming"
      dir={resolveDirection(dir)}
      {...props}
    >
      <Streamdown
        animated={{
          animation,
          duration: animationDuration,
          ...streamingAnimationSettings,
        }}
        className="min-w-0 break-words [&>*:first-child]:mt-0 [&>*:last-child]:mb-0"
        components={
          animation === "magnetize" ||
          animation === "spinIn" ||
          animation === "scaleSlam"
            ? animatedGlyphComponents
            : undefined
        }
        isAnimating={shouldAnimate}
        plugins={streamingPlugins}
      >
        {text}
      </Streamdown>
    </div>
  )
}
