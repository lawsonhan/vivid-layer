import * as React from "react"

import { cn } from "@/lib/utils"

type CropMarksLayers = "double" | "single"

type CropMarksProps = React.ComponentProps<"div"> & {
  /** "double" (default) frames the content with paired dashed lines
   * separated by layerGap — the gap between two adjacent vivid layer
   * cards; "single" keeps one line per edge, like a lone card. */
  layers?: CropMarksLayers
  /** Distance in pixels between the paired lines. */
  layerGap?: number
  /** How far every line extends past the content bounds. */
  overshoot?: number
  /** Soften every line tip; turn off for full-strength dashes. */
  fade?: boolean
}

/**
 * The vivid layer crop marks: the crossing edge-line frame from the
 * site's collage sections, packaged around a single child. The lines
 * are earlier positioned siblings of the content, so plain paint order
 * keeps them beneath it — no z-index is involved anywhere, and the
 * component never interferes with the host app's stacking (sticky
 * navs, dropdowns, or z-indexed children all behave as usual). Give
 * ancestors room (no overflow-hidden) for the overshoot.
 */
function CropMarks({
  layers = "double",
  layerGap = 32,
  overshoot = 64,
  fade = true,
  className,
  children,
  ...props
}: CropMarksProps) {
  const lineOffsets = layers === "double" ? [0, layerGap] : [0]
  const lineFade = fade ? "both" : "none"

  return (
    <div
      data-slot="crop-marks"
      data-layers={layers}
      className={cn("relative", className)}
      {...props}
    >
      {lineOffsets.map((offset) => {
        const reach = overshoot

        return (
          <React.Fragment key={offset}>
            <CropMarksLine
              axis="horizontal"
              fade={lineFade}
              style={{
                top: -(offset + 1),
                left: -reach,
                width: `calc(100% + ${reach * 2}px)`,
              }}
            />
            <CropMarksLine
              axis="horizontal"
              fade={lineFade}
              style={{
                bottom: -(offset + 1),
                left: -reach,
                width: `calc(100% + ${reach * 2}px)`,
              }}
            />
            <CropMarksLine
              axis="vertical"
              fade={lineFade}
              style={{
                left: -(offset + 1),
                top: -reach,
                height: `calc(100% + ${reach * 2}px)`,
              }}
            />
            <CropMarksLine
              axis="vertical"
              fade={lineFade}
              style={{
                right: -(offset + 1),
                top: -reach,
                height: `calc(100% + ${reach * 2}px)`,
              }}
            />
          </React.Fragment>
        )
      })}

      <div data-slot="crop-marks-content" className="relative size-full">
        {children}
      </div>
    </div>
  )
}

type CropMarksCardProps = React.ComponentProps<"div"> & {
  /** Ring outline around the surface. */
  border?: boolean
  /** The collage drop shadow under the surface. */
  shadow?: boolean
}

/** The card surface that pairs with the crop marks: the vivid layer
 * collage skin with its outline and drop shadow as switches. */
function CropMarksCard({
  border = true,
  shadow = false,
  className,
  ...props
}: CropMarksCardProps) {
  return (
    <div
      data-slot="crop-marks-card"
      className={cn(
        "rounded-xl bg-card text-card-foreground",
        border && "ring-1 ring-foreground/5 dark:ring-foreground/10",
        shadow &&
          "shadow-[0_5px_15px_rgba(0,0,0,0.08),0_15px_35px_-5px_rgba(25,28,33,0.2)]",
        className,
      )}
      {...props}
    />
  )
}

type CropMarksLineFade = "both" | "start" | "end" | "none"

type CropMarksLineProps = React.ComponentProps<"span"> & {
  /** Direction the line runs. */
  axis?: "horizontal" | "vertical"
  /** Which tips soften: "both" for a line whose ends run into empty
   * space, "start" or "end" when only that tip does (start is the left
   * or top tip), "none" for full-strength dashes end to end. */
  fade?: CropMarksLineFade
}

/** One dashed vivid layer line — the primitive the frame is drawn
 * with, exported for composite layouts (bento rows, collages) where
 * tiles share axes and a full frame per tile would draw the shared
 * lines twice. Position and size it yourself through className or
 * style; it stays out of hit testing and uses no z-index. */
function CropMarksLine({
  axis = "horizontal",
  fade = "both",
  className,
  style,
  ...props
}: CropMarksLineProps) {
  return (
    <span
      aria-hidden="true"
      style={
        {
          "--crop-marks-color": "rgba(0, 0, 0, 0.2)",
          "--crop-marks-color-dark": "rgba(255, 255, 255, 0.5)",
          maskComposite: "exclude",
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "pointer-events-none absolute",
        axis === "horizontal"
          ? [
              "h-px bg-size-[5px_1px]",
              "bg-[linear-gradient(to_right,var(--crop-marks-color),var(--crop-marks-color)_50%,transparent_0,transparent)]",
              "dark:bg-[linear-gradient(to_right,var(--crop-marks-color-dark),var(--crop-marks-color-dark)_50%,transparent_0,transparent)]",
              fade === "both" &&
                "[mask:linear-gradient(to_left,#ffffff_90%,transparent),linear-gradient(to_right,#ffffff_90%,transparent),linear-gradient(black,black)]",
              fade === "start" &&
                "[mask:linear-gradient(to_left,#ffffff_90%,transparent)]",
              fade === "end" &&
                "[mask:linear-gradient(to_right,#ffffff_90%,transparent)]",
            ]
          : [
              "w-px bg-size-[1px_5px]",
              "bg-[linear-gradient(to_bottom,var(--crop-marks-color),var(--crop-marks-color)_50%,transparent_0,transparent)]",
              "dark:bg-[linear-gradient(to_bottom,var(--crop-marks-color-dark),var(--crop-marks-color-dark)_50%,transparent_0,transparent)]",
              fade === "both" &&
                "[mask:linear-gradient(to_top,#ffffff_90%,transparent),linear-gradient(to_bottom,#ffffff_90%,transparent),linear-gradient(black,black)]",
              fade === "start" &&
                "[mask:linear-gradient(to_top,#ffffff_90%,transparent)]",
              fade === "end" &&
                "[mask:linear-gradient(to_bottom,#ffffff_90%,transparent)]",
            ],
        className,
      )}
      {...props}
    />
  )
}

export {
  CropMarks,
  CropMarksCard,
  CropMarksLine,
  type CropMarksCardProps,
  type CropMarksLayers,
  type CropMarksLineFade,
  type CropMarksLineProps,
  type CropMarksProps,
}
