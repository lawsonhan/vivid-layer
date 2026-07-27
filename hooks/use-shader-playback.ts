"use client"

import {
  useCallback,
  useEffect,
  useState,
  useSyncExternalStore,
  type RefCallback,
} from "react"

export type ShaderPlayback = "auto" | "always" | "paused"

export interface UseShaderPlaybackOptions {
  playback?: ShaderPlayback
  speed?: number
}

interface ShaderPlaybackState {
  rootRef: RefCallback<HTMLDivElement>
  speed: number | undefined
}

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"
const SHADER_VIEWPORT_MARGIN = "200px"

function subscribeToReducedMotion(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY)

  mediaQuery.addEventListener("change", onStoreChange)

  return () => mediaQuery.removeEventListener("change", onStoreChange)
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches
}

function getServerReducedMotionSnapshot() {
  return false
}

export function useShaderPlayback({
  playback = "auto",
  speed,
}: UseShaderPlaybackOptions): ShaderPlaybackState {
  const [root, setRoot] = useState<HTMLDivElement | null>(null)
  const [isNearViewport, setIsNearViewport] = useState(true)
  const prefersReducedMotion = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot
  )
  const rootRef = useCallback<RefCallback<HTMLDivElement>>((node) => {
    setRoot(node)
  }, [])

  useEffect(() => {
    if (playback !== "auto" || !root || !window.IntersectionObserver) return

    const observer = new IntersectionObserver(
      ([entry]) => setIsNearViewport(entry?.isIntersecting ?? true),
      { rootMargin: SHADER_VIEWPORT_MARGIN }
    )

    observer.observe(root)

    return () => observer.disconnect()
  }, [playback, root])

  const isPaused =
    playback === "paused" ||
    (playback === "auto" && (prefersReducedMotion || !isNearViewport))

  return {
    rootRef,
    speed: isPaused ? 0 : speed,
  }
}
