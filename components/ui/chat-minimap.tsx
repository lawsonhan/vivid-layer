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

type ChatMinimapSide = "left" | "right"

const ChatMinimapSideContext =
  React.createContext<ChatMinimapSide | null>(null)

type ChatMinimapContainerProps = React.ComponentProps<"div"> & {
  side?: ChatMinimapSide
}

function ChatMinimapContainer({
  side = "left",
  className,
  ...props
}: ChatMinimapContainerProps) {
  return (
    <ChatMinimapSideContext.Provider value={side}>
      <div
        data-slot="chat-minimap-container"
        data-side={side}
        className={cn(
          "relative flex min-h-0",
          "*:data-[slot=message-scroller]:min-w-0 *:data-[slot=message-scroller]:flex-1",
          // The minimap floats over the transcript edge in a rail the content
          // padding reserves, so the viewport's native scrollbar keeps its
          // usual place at the right edge — outside the minimap, never
          // between it and the messages.
          "*:data-[slot=chat-minimap]:absolute *:data-[slot=chat-minimap]:top-1/2 *:data-[slot=chat-minimap]:z-10 *:data-[slot=chat-minimap]:-translate-y-1/2",
          side === "right"
            ? [
                // right-5 clears the scrollbar; the rail's slack absorbs the
                // difference between real and assumed scrollbar widths.
                "*:data-[slot=chat-minimap]:right-5",
                "**:data-[slot=message-scroller-content]:pe-20",
              ]
            : [
                "*:data-[slot=chat-minimap]:left-3.5",
                "**:data-[slot=message-scroller-content]:ps-20",
              ],
          className
        )}
        {...props}
      />
    </ChatMinimapSideContext.Provider>
  )
}

type ChatMinimapProps = React.ComponentProps<"nav"> & {
  items: readonly ChatMinimapItem[]
  /** Used outside a ChatMinimapContainer; inside one, the container's side wins. */
  side?: ChatMinimapSide
  /** Runs before a marker jumps; call event.preventDefault() to take over. */
  onItemSelect?: (
    item: ChatMinimapItem,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void
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
  side: sideProp,
  onItemSelect,
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
  const containerSide = React.useContext(ChatMinimapSideContext)
  // The container positions the rail, so its side must win or the markers
  // and previews would flip while the rail stays put.
  const side = containerSide ?? sideProp ?? "left"
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null)
  const { scrollToMessage } = useMessageScroller()
  const { currentAnchorId } = useMessageScrollerVisibility()

  function selectItem(
    item: ChatMinimapItem,
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    onItemSelect?.(item, event)

    if (event.defaultPrevented) return

    scrollToMessage(item.id, { align: "nearest", behavior: "smooth" })
  }

  return (
    <nav
      data-slot="chat-minimap"
      data-side={side}
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
                  data-slot="chat-minimap-item"
                  data-current={isCurrent || undefined}
                  aria-label={`Jump to: ${item.title}`}
                  aria-current={isCurrent ? "location" : undefined}
                  className={cn(
                    "group/chat-minimap-item flex items-center rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                    side === "right" && "justify-end"
                  )}
                  style={{
                    height: itemSize,
                    width: itemSize * magnification,
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onFocus={() => setHoveredIndex(index)}
                  onBlur={() => setHoveredIndex(null)}
                  onClick={(event) => selectItem(item, event)}
                />
              }
            >
              <span
                data-slot="chat-minimap-marker"
                data-current={isCurrent}
                className="rounded-full bg-muted-foreground/40 transition-[width,background-color] group-hover/chat-minimap-item:bg-muted-foreground group-focus-visible/chat-minimap-item:bg-muted-foreground data-[current=true]:bg-foreground"
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
              data-slot="chat-minimap-preview"
              side={side === "right" ? "left" : "right"}
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

export {
  ChatMinimap,
  ChatMinimapContainer,
  type ChatMinimapContainerProps,
  type ChatMinimapItem,
  type ChatMinimapProps,
  type ChatMinimapSide,
}
