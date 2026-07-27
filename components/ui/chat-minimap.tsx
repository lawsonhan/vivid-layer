"use client"

import * as React from "react"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  useMessageScroller,
  useMessageScrollerVisibility,
} from "@/components/ui/message-scroller"
import { cn } from "@/lib/utils"

type ChatMinimapItem = {
  id: string
  title: string
  description: string
}

type ChatMinimapProps = React.ComponentProps<"nav"> & {
  items: readonly ChatMinimapItem[]
  magnification?: number
  lensRange?: number
  itemSize?: number
  gap?: number
  pillWidth?: number
  transitionDuration?: number
  easing?: React.CSSProperties["transitionTimingFunction"]
}

function ChatMinimap({
  items,
  magnification = 3,
  lensRange = 3,
  itemSize = 12,
  gap = 0,
  pillWidth = 2,
  transitionDuration = 200,
  easing = "ease-out",
  className,
  style,
  ...props
}: ChatMinimapProps) {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const { scrollToMessage } = useMessageScroller()
  const { currentAnchorId } = useMessageScrollerVisibility()

  function selectItem(id: string) {
    scrollToMessage(id, {
      align: "nearest",
      behavior: "smooth",
    })
  }

  return (
    <nav
      data-slot="chat-minimap"
      aria-label="Chat minimap"
      className={cn("flex flex-col items-start", className)}
      style={{ gap, ...style }}
      {...props}
    >
      {items.map((item, index) => {
        const isCurrent = item.id === currentAnchorId

        return (
          <HoverCard key={item.id}>
            <HoverCardTrigger
              delay={100}
              closeDelay={100}
              render={
                <button
                  type="button"
                  aria-label={`Jump to: ${item.title}`}
                  aria-current={isCurrent ? "location" : undefined}
                  className="group flex items-center rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                  style={{
                    height: itemSize,
                    width: itemSize * magnification,
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                  onClick={() => selectItem(item.id)}
                />
              }
            >
              <span
                data-current={isCurrent}
                className="rounded-full bg-muted-foreground/40 transition-[width,background-color] group-hover:bg-muted-foreground group-focus-visible:bg-muted-foreground motion-reduce:transition-none data-[current=true]:bg-foreground"
                style={{
                  width: getMarkerWidth(
                    index,
                    hoveredIndex,
                    itemSize,
                    itemSize * magnification,
                    lensRange
                  ),
                  height: pillWidth,
                  transitionDuration: `${transitionDuration}ms`,
                  transitionTimingFunction: easing,
                }}
              />
            </HoverCardTrigger>
            <HoverCardContent
              side="right"
              sideOffset={8}
              className="flex w-72 flex-col gap-1"
            >
              <p className="line-clamp-1 text-base font-medium">
                {item.title}
              </p>
              <p className="line-clamp-4 text-sm font-light text-muted-foreground">
                {item.description}
              </p>
            </HoverCardContent>
          </HoverCard>
        )
      })}
    </nav>
  )
}

// Adapted from Mantine Lens Select (MIT): https://github.com/gfazioli/mantine-lens-select
function getMarkerWidth(
  index: number,
  hoveredIndex: number | null,
  minWidth: number,
  maxWidth: number,
  range: number
) {
  if (hoveredIndex === null) return minWidth

  const distance = Math.abs(index - hoveredIndex)
  if (distance >= range) return minWidth

  const factor = (1 + Math.cos((Math.PI * distance) / range)) / 2
  return minWidth + (maxWidth - minWidth) * factor
}

export { ChatMinimap, type ChatMinimapItem, type ChatMinimapProps }
