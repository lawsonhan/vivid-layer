"use client"

import {
  useLayoutEffect,
  useMemo,
  useRef,
  type ComponentProps,
  type RefCallback,
} from "react"

import { cn } from "@/lib/utils"

const GRID_SIDE = 5
const CELL_COUNT = GRID_SIDE * GRID_SIDE
const GRID_CENTER = (GRID_SIDE - 1) / 2
const CURVE_SAMPLE_COUNT = 256
const TAU = Math.PI * 2
const BASE_OPACITY = 0.08
const STATIC_PEAK_OPACITY = 0.3
const HEAD_WIDTH_STEPS = 0.45
const TRAIL_DECAY = 0.46
const OPACITY_EPSILON = 1 / 255

type TrajectorySampler = (phase: number, point: Float64Array) => void

type GridTrajectoryRecipe = Readonly<{
  duration: number
  tailLength: number
  trajectories: readonly TrajectorySampler[]
}>

type CompiledGridMotionRecipe = Readonly<{
  duration: number
  tailLength: number
  trajectories: readonly Uint8Array[]
  initialFrame: Float32Array
  staticFrame: Float32Array
}>

export type GridLoaderVariant =
  | "sweep"
  | "trace"
  | "spiral"
  | "ribbon"
  | "classifying"
  | "orbit"

export type GridLoaderProps = Omit<ComponentProps<"span">, "children"> & {
  variant?: GridLoaderVariant
  size?: number
  dotSize?: number
  duration?: number
  label?: string
}

type FrameListener = (now: number) => void

const frameListeners = new Set<FrameListener>()
let frameRequest: number | null = null

function requestFrame() {
  if (frameRequest !== null || frameListeners.size === 0) return

  frameRequest = window.requestAnimationFrame(runFrame)
}

function runFrame(now: number) {
  frameRequest = null

  for (const listener of frameListeners) listener(now)

  requestFrame()
}

function subscribeFrame(listener: FrameListener) {
  let subscribed = true

  frameListeners.add(listener)
  requestFrame()

  return () => {
    if (!subscribed) return

    subscribed = false
    frameListeners.delete(listener)

    if (frameListeners.size === 0 && frameRequest !== null) {
      window.cancelAnimationFrame(frameRequest)
      frameRequest = null
    }
  }
}

function wrapPhase(phase: number) {
  const wrapped = phase % 1

  return wrapped < 0 ? wrapped + 1 : wrapped
}

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(maximum, Math.max(minimum, value))
}

function smoothstep01(value: number) {
  const progress = clamp(value, 0, 1)

  return progress * progress * (3 - 2 * progress)
}

function triangleWave(phase: number) {
  return 1 - 4 * Math.abs(wrapPhase(phase) - 0.5)
}

function sweepTrajectory(phase: number, point: Float64Array) {
  point[0] = 0.96 * triangleWave(phase * 5 + 0.1)
  point[1] = 0.94 * triangleWave(phase + 0.125)
}

function traceTrajectory(phase: number, point: Float64Array) {
  const angle = TAU * phase + Math.PI / 8
  const radius = 0.96 * Math.cos(angle * 2)

  point[0] = radius * Math.cos(angle)
  point[1] = radius * Math.sin(angle)
}

function spiralTrajectory(phase: number, point: Float64Array) {
  const angle = TAU * phase * 2 - Math.PI / 2
  const radius = 0.96 * Math.sin(Math.PI * phase)

  point[0] = radius * Math.cos(angle)
  point[1] = radius * Math.sin(angle)
}

function ribbonTrajectory(phase: number, point: Float64Array) {
  point[0] = 0.96 * Math.sin(TAU * phase * 2 + Math.PI / 2)
  point[1] = 0.9 * Math.sin(TAU * phase * 3)
}

function classifyingLeftTrajectory(phase: number, point: Float64Array) {
  const radius = 0.96 * Math.sin(Math.PI * phase)
  const angle = Math.PI + 1.25 * TAU * phase

  point[0] = radius * Math.cos(angle)
  point[1] = radius * Math.sin(angle)
}

function classifyingRightTrajectory(phase: number, point: Float64Array) {
  const radius = 0.96 * Math.sin(Math.PI * phase)
  const angle = Math.PI + 1.25 * TAU * phase

  point[0] = -radius * Math.cos(angle)
  point[1] = -radius * Math.sin(angle)
}

function orbitTrajectory(phase: number, point: Float64Array) {
  const angle = TAU * phase
  const radius = 0.82 + 0.15 * Math.cos(angle * 3 + Math.PI / 6)

  point[0] = radius * Math.cos(angle)
  point[1] = 0.86 * radius * Math.sin(angle)
}

const GRID_TRAJECTORY_RECIPES: Readonly<
  Record<GridLoaderVariant, GridTrajectoryRecipe>
> = Object.freeze({
  sweep: Object.freeze({
    duration: 1360,
    tailLength: 5,
    trajectories: Object.freeze([sweepTrajectory]),
  }),
  trace: Object.freeze({
    duration: 1440,
    tailLength: 7,
    trajectories: Object.freeze([traceTrajectory]),
  }),
  spiral: Object.freeze({
    duration: 1320,
    tailLength: 6,
    trajectories: Object.freeze([spiralTrajectory]),
  }),
  ribbon: Object.freeze({
    duration: 1600,
    tailLength: 6,
    trajectories: Object.freeze([ribbonTrajectory]),
  }),
  classifying: Object.freeze({
    duration: 1600,
    tailLength: 5,
    trajectories: Object.freeze([
      classifyingLeftTrajectory,
      classifyingRightTrajectory,
    ]),
  }),
  orbit: Object.freeze({
    duration: 1280,
    tailLength: 6,
    trajectories: Object.freeze([orbitTrajectory]),
  }),
})

function cellRow(index: number) {
  return Math.floor(index / GRID_SIDE)
}

function cellColumn(index: number) {
  return index % GRID_SIDE
}

function snapToCell(x: number, y: number) {
  const column = Math.round((clamp(x, -1, 1) + 1) * GRID_CENTER)
  const row = Math.round((clamp(y, -1, 1) + 1) * GRID_CENTER)

  return row * GRID_SIDE + column
}

function appendBridgedVisit(visits: number[], target: number) {
  if (visits.length === 0) {
    visits.push(target)
    return
  }

  let current = visits[visits.length - 1]

  if (current === target) return

  const targetRow = cellRow(target)
  const targetColumn = cellColumn(target)

  while (current !== target) {
    const row = cellRow(current)
    const column = cellColumn(current)
    const nextRow = row + Math.sign(targetRow - row)
    const nextColumn = column + Math.sign(targetColumn - column)

    current = nextRow * GRID_SIDE + nextColumn
    visits.push(current)
  }
}

function closeVisits(visits: number[]) {
  if (visits.length < 2) return

  const first = visits[0]

  if (visits[visits.length - 1] === first) visits.pop()

  let current = visits[visits.length - 1]
  const firstRow = cellRow(first)
  const firstColumn = cellColumn(first)

  while (
    Math.max(
      Math.abs(firstRow - cellRow(current)),
      Math.abs(firstColumn - cellColumn(current))
    ) > 1
  ) {
    const row = cellRow(current)
    const column = cellColumn(current)
    const nextRow = row + Math.sign(firstRow - row)
    const nextColumn = column + Math.sign(firstColumn - column)

    current = nextRow * GRID_SIDE + nextColumn
    visits.push(current)
  }
}

function compileTrajectory(trajectory: TrajectorySampler) {
  const point = new Float64Array(2)
  const sampleX = new Float64Array(CURVE_SAMPLE_COUNT)
  const sampleY = new Float64Array(CURVE_SAMPLE_COUNT)
  const cumulativeLength = new Float64Array(CURVE_SAMPLE_COUNT + 1)

  for (let index = 0; index < CURVE_SAMPLE_COUNT; index += 1) {
    trajectory(index / CURVE_SAMPLE_COUNT, point)

    if (!Number.isFinite(point[0]) || !Number.isFinite(point[1])) {
      throw new Error("Grid Loader trajectory returned a non-finite point.")
    }

    sampleX[index] = point[0]
    sampleY[index] = point[1]
  }

  for (let index = 0; index < CURVE_SAMPLE_COUNT; index += 1) {
    const nextIndex = (index + 1) % CURVE_SAMPLE_COUNT
    const segmentLength = Math.hypot(
      sampleX[nextIndex] - sampleX[index],
      sampleY[nextIndex] - sampleY[index]
    )

    cumulativeLength[index + 1] =
      cumulativeLength[index] + segmentLength
  }

  const totalLength = cumulativeLength[CURVE_SAMPLE_COUNT]

  if (!Number.isFinite(totalLength) || totalLength <= Number.EPSILON) {
    throw new Error("Grid Loader trajectory must have a measurable length.")
  }

  const visits: number[] = []
  let segmentIndex = 0

  for (let index = 0; index < CURVE_SAMPLE_COUNT; index += 1) {
    const targetLength = (totalLength * index) / CURVE_SAMPLE_COUNT

    while (
      segmentIndex < CURVE_SAMPLE_COUNT - 1 &&
      cumulativeLength[segmentIndex + 1] <= targetLength
    ) {
      segmentIndex += 1
    }

    const nextIndex = (segmentIndex + 1) % CURVE_SAMPLE_COUNT
    const segmentStart = cumulativeLength[segmentIndex]
    const segmentLength =
      cumulativeLength[segmentIndex + 1] - segmentStart
    const segmentPhase =
      segmentLength > 0 ? (targetLength - segmentStart) / segmentLength : 0
    const x =
      sampleX[segmentIndex] +
      (sampleX[nextIndex] - sampleX[segmentIndex]) * segmentPhase
    const y =
      sampleY[segmentIndex] +
      (sampleY[nextIndex] - sampleY[segmentIndex]) * segmentPhase

    appendBridgedVisit(visits, snapToCell(x, y))
  }

  closeVisits(visits)

  return Uint8Array.from(visits)
}

function createStaticFrame(trajectories: readonly Uint8Array[]) {
  const coverage = new Uint16Array(CELL_COUNT)
  const frame = new Float32Array(CELL_COUNT)
  let maximumCoverage = 0

  for (
    let trajectoryIndex = 0;
    trajectoryIndex < trajectories.length;
    trajectoryIndex += 1
  ) {
    const visits = trajectories[trajectoryIndex]

    for (let visitIndex = 0; visitIndex < visits.length; visitIndex += 1) {
      const cell = visits[visitIndex]

      coverage[cell] += 1
      maximumCoverage = Math.max(maximumCoverage, coverage[cell])
    }
  }

  for (let index = 0; index < CELL_COUNT; index += 1) {
    const strength =
      maximumCoverage === 0
        ? 0
        : Math.sqrt(coverage[index] / maximumCoverage)

    frame[index] =
      BASE_OPACITY + (STATIC_PEAK_OPACITY - BASE_OPACITY) * strength
  }

  return frame
}

function sampleMotionFrame(
  recipe: Pick<
    CompiledGridMotionRecipe,
    "tailLength" | "trajectories"
  >,
  phase: number,
  frame: Float32Array
) {
  frame.fill(BASE_OPACITY)

  const cycle = wrapPhase(phase)

  for (
    let trajectoryIndex = 0;
    trajectoryIndex < recipe.trajectories.length;
    trajectoryIndex += 1
  ) {
    const visits = recipe.trajectories[trajectoryIndex]
    const visitCount = visits.length
    const headPosition = cycle * visitCount

    for (let visitIndex = 0; visitIndex < visitCount; visitIndex += 1) {
      let lagSteps = headPosition - visitIndex

      if (lagSteps < 0) lagSteps += visitCount

      const headDistance = Math.min(lagSteps, visitCount - lagSteps)
      const head = Math.exp(
        -0.5 * Math.pow(headDistance / HEAD_WIDTH_STEPS, 2)
      )
      let trail = 0

      if (lagSteps < recipe.tailLength) {
        const cutoff =
          1 -
          smoothstep01(
            lagSteps - Math.max(0, recipe.tailLength - 1)
          )

        trail = Math.exp(-TRAIL_DECAY * lagSteps) * cutoff
      }

      const strength = Math.max(head, trail)
      const opacity = BASE_OPACITY + (1 - BASE_OPACITY) * strength
      const cell = visits[visitIndex]

      frame[cell] = Math.max(frame[cell], opacity)
    }
  }
}

function compileRecipe(recipe: GridTrajectoryRecipe) {
  const trajectories = Object.freeze(
    recipe.trajectories.map(compileTrajectory)
  )
  const compiled: CompiledGridMotionRecipe = {
    duration: recipe.duration,
    tailLength: recipe.tailLength,
    trajectories,
    initialFrame: new Float32Array(CELL_COUNT),
    staticFrame: createStaticFrame(trajectories),
  }

  sampleMotionFrame(compiled, 0, compiled.initialFrame)

  return Object.freeze(compiled)
}

const GRID_MOTION_RECIPES: Readonly<
  Record<GridLoaderVariant, CompiledGridMotionRecipe>
> = Object.freeze({
  sweep: compileRecipe(GRID_TRAJECTORY_RECIPES.sweep),
  trace: compileRecipe(GRID_TRAJECTORY_RECIPES.trace),
  spiral: compileRecipe(GRID_TRAJECTORY_RECIPES.spiral),
  ribbon: compileRecipe(GRID_TRAJECTORY_RECIPES.ribbon),
  classifying: compileRecipe(GRID_TRAJECTORY_RECIPES.classifying),
  orbit: compileRecipe(GRID_TRAJECTORY_RECIPES.orbit),
})

function initialOpacity(value: number) {
  return Math.round(value * 1_000_000) / 1_000_000
}

const GRID_CELLS = Object.freeze(
  Array.from({ length: CELL_COUNT }, (_, index) => index)
)

export function GridLoader({
  variant = "orbit",
  size = 16,
  dotSize = 2,
  duration,
  label,
  className,
  style,
  ...props
}: GridLoaderProps) {
  const recipe = GRID_MOTION_RECIPES[variant]
  const resolvedSize = Math.max(9, Number.isFinite(size) ? size : 16)
  const maximumDotSize = Math.max(1, (resolvedSize - 4) / GRID_SIDE)
  const resolvedDotSize = Math.min(
    maximumDotSize,
    Math.max(1, Number.isFinite(dotSize) ? dotSize : 2)
  )
  const gap = Math.max(
    1,
    Math.floor(
      (resolvedSize - resolvedDotSize * GRID_SIDE) / (GRID_SIDE - 1)
    )
  )
  const resolvedDuration =
    duration !== undefined && Number.isFinite(duration) && duration > 0
      ? duration
      : recipe.duration
  const dotRefs = useRef<Array<HTMLSpanElement | null>>(
    Array.from({ length: CELL_COUNT }, () => null)
  )
  const phaseRef = useRef(0)
  const previousTimeRef = useRef<number | null>(null)
  const frame = useMemo(() => new Float32Array(CELL_COUNT), [])
  const previousOpacity = useMemo(() => {
    const values = new Float32Array(CELL_COUNT)

    values.fill(Number.NaN)
    return values
  }, [])
  const dotRefSetters = useMemo(
    () =>
      GRID_CELLS.map<RefCallback<HTMLSpanElement>>(
        (_, index) => (node) => {
          dotRefs.current[index] = node
        }
      ),
    []
  )

  useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    let unsubscribe: (() => void) | null = null

    const draw = (reducedMotion: boolean) => {
      const nextFrame = reducedMotion ? recipe.staticFrame : frame

      if (!reducedMotion) {
        sampleMotionFrame(recipe, phaseRef.current, nextFrame)
      }

      for (let index = 0; index < CELL_COUNT; index += 1) {
        const dot = dotRefs.current[index]

        if (!dot) {
          previousOpacity[index] = Number.NaN
          continue
        }

        const nextOpacity = nextFrame[index]

        if (
          Math.abs(nextOpacity - previousOpacity[index]) <= OPACITY_EPSILON
        ) {
          continue
        }

        dot.style.opacity = String(nextOpacity)
        previousOpacity[index] = nextOpacity
      }
    }

    const stop = () => {
      unsubscribe?.()
      unsubscribe = null
      previousTimeRef.current = null
    }

    const start = () => {
      if (unsubscribe) return

      unsubscribe = subscribeFrame((now) => {
        const previousTime = previousTimeRef.current

        previousTimeRef.current = now
        if (previousTime !== null) {
          phaseRef.current = wrapPhase(
            phaseRef.current + (now - previousTime) / resolvedDuration
          )
        }

        draw(false)
      })
    }

    const syncMotionPreference = () => {
      stop()
      previousOpacity.fill(Number.NaN)

      if (media.matches) {
        draw(true)
        return
      }

      draw(false)
      start()
    }

    syncMotionPreference()
    media.addEventListener("change", syncMotionPreference)

    return () => {
      media.removeEventListener("change", syncMotionPreference)
      stop()
    }
  }, [frame, previousOpacity, recipe, resolvedDuration])

  return (
    <span
      {...props}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "status" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center align-middle",
        className
      )}
      data-slot="grid-loader"
      data-variant={variant}
      style={{ height: resolvedSize, width: resolvedSize, ...style }}
    >
      <span
        className="grid"
        style={{
          gap,
          gridTemplateColumns: `repeat(${GRID_SIDE}, ${resolvedDotSize}px)`,
          gridTemplateRows: `repeat(${GRID_SIDE}, ${resolvedDotSize}px)`,
        }}
      >
        {GRID_CELLS.map((cell, index) => (
          <span
            className="block rounded-full bg-current will-change-[opacity] motion-reduce:will-change-auto"
            key={cell}
            ref={dotRefSetters[index]}
            style={{
              height: resolvedDotSize,
              opacity: initialOpacity(recipe.initialFrame[index]),
              width: resolvedDotSize,
            }}
          />
        ))}
      </span>
    </span>
  )
}
