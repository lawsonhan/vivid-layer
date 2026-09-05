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
  overshoot = 72,
  fade = true,
  className,
  style,
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
      style={
        { "--crop-marks-fade": `${overshoot}px`, ...style } as React.CSSProperties
      }
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
 * style; it stays out of hit testing and uses no z-index. A fading
 * tip softens over --crop-marks-fade (inherited; the frame and the
 * grid set it to their overshoot so every tip fades over the same
 * distance whatever the line's length), falling back to 10%. The dash
 * color reads the inherited --crop-marks-color, falling back to
 * translucent black (light) or white (dark); set it on any ancestor
 * to recolor every line inside. */
function CropMarksLine({
  axis = "horizontal",
  fade = "both",
  className,
  style,
  ...props
}: CropMarksLineProps) {
  return (
    <span
      data-slot="crop-marks-line"
      data-axis={axis}
      aria-hidden="true"
      style={{ maskComposite: "exclude", ...style }}
      className={cn(
        "pointer-events-none absolute",
        axis === "horizontal"
          ? [
              "h-px bg-size-[5px_1px]",
              "bg-[linear-gradient(to_right,var(--crop-marks-color,rgba(0,0,0,0.2)),var(--crop-marks-color,rgba(0,0,0,0.2))_50%,transparent_0,transparent)]",
              "dark:bg-[linear-gradient(to_right,var(--crop-marks-color,rgba(255,255,255,0.5)),var(--crop-marks-color,rgba(255,255,255,0.5))_50%,transparent_0,transparent)]",
              fade === "both" &&
                "[mask:linear-gradient(to_left,#ffffff_calc(100%_-_var(--crop-marks-fade,10%)),transparent),linear-gradient(to_right,#ffffff_calc(100%_-_var(--crop-marks-fade,10%)),transparent),linear-gradient(black,black)]",
              fade === "start" &&
                "[mask:linear-gradient(to_left,#ffffff_calc(100%_-_var(--crop-marks-fade,10%)),transparent)]",
              fade === "end" &&
                "[mask:linear-gradient(to_right,#ffffff_calc(100%_-_var(--crop-marks-fade,10%)),transparent)]",
            ]
          : [
              "w-px bg-size-[1px_5px]",
              "bg-[linear-gradient(to_bottom,var(--crop-marks-color,rgba(0,0,0,0.2)),var(--crop-marks-color,rgba(0,0,0,0.2))_50%,transparent_0,transparent)]",
              "dark:bg-[linear-gradient(to_bottom,var(--crop-marks-color,rgba(255,255,255,0.5)),var(--crop-marks-color,rgba(255,255,255,0.5))_50%,transparent_0,transparent)]",
              fade === "both" &&
                "[mask:linear-gradient(to_top,#ffffff_calc(100%_-_var(--crop-marks-fade,10%)),transparent),linear-gradient(to_bottom,#ffffff_calc(100%_-_var(--crop-marks-fade,10%)),transparent),linear-gradient(black,black)]",
              fade === "start" &&
                "[mask:linear-gradient(to_top,#ffffff_calc(100%_-_var(--crop-marks-fade,10%)),transparent)]",
              fade === "end" &&
                "[mask:linear-gradient(to_bottom,#ffffff_calc(100%_-_var(--crop-marks-fade,10%)),transparent)]",
            ],
        className,
      )}
      {...props}
    />
  )
}

type CropMarksGridBreakpoint = "md" | "lg"

type CropMarksGridTip = "open" | "joined"

type CropMarksGridLine = {
  axis: "horizontal" | "vertical"
  /** Which edge of its track the line hugs: "start" sits 1px before
   * the track, "end" 1px after it, and "gutter" (single layer) is the
   * one line centered in the gap after it. */
  side: "start" | "end" | "gutter"
  /** 1-based grid lines, end exclusive, of the area the line spans. */
  columnStart: number
  columnEnd: number
  rowStart: number
  rowEnd: number
  /** What each tip runs into: "open" empty space (overshoot and
   * fade), "joined" a tile spanning the gutter (stop at its edge,
   * full strength). Start is the left or top tip. */
  startTip: CropMarksGridTip
  endTip: CropMarksGridTip
  /** Outer rails frame the whole grid rather than one gutter. */
  rail: boolean
}

const EMPTY_AREA = "."

function parseCropMarksGridAreas(areas: readonly string[]) {
  const cells = areas.map((row) => row.trim().split(/\s+/))
  const columns = cells[0]?.length ?? 0

  if (columns === 0 || cells.some((row) => row.length !== columns)) {
    throw new Error(
      "CropMarksGrid areas must be a rectangular grid of area names"
    )
  }

  return { cells, columns, rows: cells.length }
}

/**
 * Every line a bento layout needs, derived from its grid-template-areas
 * rows. Lines belong to track edges: with double layers each gutter
 * gets a pair (1px after the track before it, 1px before the track
 * after it), with a single layer one line centered in the gap — in
 * both cases only across the cells where the two neighbors are
 * different areas; where one tile spans the gutter there is no line.
 * A segment tip at the grid boundary is open (it overshoots and
 * fades); a tip that stops because the next cell is spanned by one
 * tile is joined (it reaches that tile's edge at full strength).
 * Double-layer lines owned by an empty "." cell are skipped. The four
 * outer rails are always open.
 */
function deriveCropMarksGridLines(
  areas: readonly string[],
  layers: CropMarksLayers = "double"
): CropMarksGridLine[] {
  const { cells, columns, rows } = parseCropMarksGridAreas(areas)
  const lines: CropMarksGridLine[] = []

  function collect(
    axis: CropMarksGridLine["axis"],
    boundary: number,
    length: number,
    before: (index: number) => string,
    after: (index: number) => string
  ) {
    const joinedAt = (index: number) =>
      index >= 0 &&
      index < length &&
      before(index) === after(index) &&
      before(index) !== EMPTY_AREA

    const sides =
      layers === "double" ? (["end", "start"] as const) : (["gutter"] as const)

    for (const side of sides) {
      const owner = side === "start" ? after : before
      let start = -1

      for (let index = 0; index <= length; index += 1) {
        const visible =
          index < length &&
          before(index) !== after(index) &&
          (side === "gutter" || owner(index) !== EMPTY_AREA)

        if (visible && start < 0) start = index
        if (visible || start < 0) continue

        const track = side === "start" ? boundary + 1 : boundary
        const span = { start: start + 1, end: index + 1 }
        lines.push({
          axis,
          side,
          columnStart: axis === "vertical" ? track : span.start,
          columnEnd: axis === "vertical" ? track + 1 : span.end,
          rowStart: axis === "vertical" ? span.start : track,
          rowEnd: axis === "vertical" ? span.end : track + 1,
          startTip: joinedAt(start - 1) ? "joined" : "open",
          endTip: joinedAt(index) ? "joined" : "open",
          rail: false,
        })
        start = -1
      }
    }
  }

  for (let boundary = 1; boundary < columns; boundary += 1) {
    collect(
      "vertical",
      boundary,
      rows,
      (row) => cells[row][boundary - 1],
      (row) => cells[row][boundary]
    )
  }
  for (let boundary = 1; boundary < rows; boundary += 1) {
    collect(
      "horizontal",
      boundary,
      columns,
      (column) => cells[boundary - 1][column],
      (column) => cells[boundary][column]
    )
  }

  const rail = {
    columnStart: 1,
    columnEnd: columns + 1,
    rowStart: 1,
    rowEnd: rows + 1,
    startTip: "open" as const,
    endTip: "open" as const,
    rail: true,
  }
  lines.push(
    { ...rail, axis: "vertical", side: "start" },
    { ...rail, axis: "vertical", side: "end" },
    { ...rail, axis: "horizontal", side: "start" },
    { ...rail, axis: "horizontal", side: "end" }
  )

  return lines
}

const tipFade: Record<`${CropMarksGridTip}-${CropMarksGridTip}`, CropMarksLineFade> =
  {
    "open-open": "both",
    "open-joined": "start",
    "joined-open": "end",
    "joined-joined": "none",
  }

// Static class sets per breakpoint so Tailwind can see every variant.
// Items read the grid's data-breakpoint through the named group, which
// keeps the component free of React context (it stays a server
// component).
const gridLayoutClassName: Record<CropMarksGridBreakpoint, string> = {
  md: "md:[grid-template-columns:var(--crop-marks-grid-columns)] md:[grid-template-areas:var(--crop-marks-grid-areas)]",
  lg: "lg:[grid-template-columns:var(--crop-marks-grid-columns)] lg:[grid-template-areas:var(--crop-marks-grid-areas)]",
}
const layoutOnlyClassName: Record<CropMarksGridBreakpoint, string> = {
  md: "hidden md:block",
  lg: "hidden lg:block",
}
const itemAreaClassName =
  "group-data-[breakpoint=md]/crop-marks-grid:md:[grid-area:var(--crop-marks-grid-area)] group-data-[breakpoint=lg]/crop-marks-grid:lg:[grid-area:var(--crop-marks-grid-area)]"
const stackedOnlyClassName =
  "group-data-[breakpoint=md]/crop-marks-grid:md:hidden group-data-[breakpoint=lg]/crop-marks-grid:lg:hidden"
// With a single layer, stacked tiles share one line per seam: each
// draws its top line and the grid's bottom rail closes the stack.
const stackedBottomClassName =
  "group-data-[layers=single]/crop-marks-grid:hidden"

type CropMarksGridProps = React.ComponentProps<"div"> & {
  /** The layout as grid-template-areas rows, e.g. ["a b c", "a d c"];
   * "." leaves a cell empty. */
  areas: readonly string[]
  /** "double" (default) gives every gutter the paired lines of two
   * adjacent vivid layer cards; "single" draws one line per gutter for
   * tiles that touch across a hairline gap. */
  layers?: CropMarksLayers
  /** Gutter in pixels between tiles. */
  gap?: number
  /** How far tips that run into empty space extend past the grid. */
  overshoot?: number
  /** Viewport breakpoint where the areas layout applies; below it the
   * tiles stack in DOM order. */
  breakpoint?: CropMarksGridBreakpoint
}

/**
 * A bento grid that draws its crop marks from the layout: pass the
 * areas and place each tile with CropMarksGridItem. Every visible axis
 * is drawn once; a line that meets a tile spanning the gutter stops at
 * that tile's edge at full strength, and only tips that run into empty
 * space fade. The lines are earlier positioned siblings of the tiles,
 * so plain paint order keeps them beneath — no z-index anywhere.
 * Below the breakpoint the tiles stack and each draws its own top and
 * bottom lines while the grid keeps the two side rails. A single
 * layer (tiles touching across a 1px gap, like a pricing table) draws
 * one line per gutter instead of the pair.
 */
function CropMarksGrid({
  areas,
  layers = "double",
  gap = 32,
  overshoot = 72,
  breakpoint = "md",
  className,
  style,
  children,
  ...props
}: CropMarksGridProps) {
  const lines = deriveCropMarksGridLines(areas, layers)
  const columns = parseCropMarksGridAreas(areas).columns

  return (
    <div
      data-slot="crop-marks-grid"
      data-breakpoint={breakpoint}
      data-layers={layers}
      className={cn(
        "group/crop-marks-grid relative grid grid-cols-1",
        gridLayoutClassName[breakpoint],
        className
      )}
      style={
        {
          gap,
          "--crop-marks-fade": `${overshoot}px`,
          "--crop-marks-grid-overshoot": `${overshoot}px`,
          "--crop-marks-grid-columns": `repeat(${columns}, minmax(0, 1fr))`,
          "--crop-marks-grid-areas": areas
            .map((row) => `"${row.trim()}"`)
            .join(" "),
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {lines.map((line, index) => {
        const startReach = line.startTip === "open" ? overshoot : gap
        const endReach = line.endTip === "open" ? overshoot : gap
        // Distance past the track: 1px for a card's own line, half the
        // gap (rounded out) for the single line centered in a gutter.
        const edge = line.side === "start" ? -1 : undefined
        const after = line.side === "gutter" ? -Math.ceil((gap + 1) / 2) : -1
        // The side rails frame the stacked tiles too; with a single
        // layer so does the bottom rail, since stacked tiles then draw
        // only their top line.
        const alwaysVisible =
          line.rail &&
          (line.axis === "vertical" ||
            (layers === "single" && line.side === "end"))
        const placement = line.rail
          ? undefined
          : {
              gridColumn: `${line.columnStart} / ${line.columnEnd}`,
              gridRow: `${line.rowStart} / ${line.rowEnd}`,
            }

        return (
          <CropMarksLine
            key={index}
            axis={line.axis}
            fade={tipFade[`${line.startTip}-${line.endTip}`]}
            data-rail={line.rail ? "true" : undefined}
            className={
              alwaysVisible ? undefined : layoutOnlyClassName[breakpoint]
            }
            style={
              line.axis === "vertical"
                ? {
                    ...placement,
                    left: edge,
                    right: edge === undefined ? after : undefined,
                    top: -startReach,
                    height: `calc(100% + ${startReach + endReach}px)`,
                  }
                : {
                    ...placement,
                    top: edge,
                    bottom: edge === undefined ? after : undefined,
                    left: -startReach,
                    width: `calc(100% + ${startReach + endReach}px)`,
                  }
            }
          />
        )
      })}

      {children}
    </div>
  )
}

type CropMarksGridItemProps = React.ComponentProps<"div"> & {
  /** The area name from the grid's areas this tile fills. */
  area: string
}

/** One tile of a CropMarksGrid; wrap a CropMarksCard (or any opaque
 * block) with it. Stacked below the breakpoint, it draws its own top
 * and bottom lines since each stacked edge is a unique axis there. */
function CropMarksGridItem({
  area,
  className,
  style,
  children,
  ...props
}: CropMarksGridItemProps) {
  const stackedLineStyle = {
    left: "calc(var(--crop-marks-grid-overshoot) * -1)",
    width: "calc(100% + var(--crop-marks-grid-overshoot) * 2)",
  }

  return (
    <div
      data-slot="crop-marks-grid-item"
      className={cn("relative flex flex-col", itemAreaClassName, className)}
      style={
        { "--crop-marks-grid-area": area, ...style } as React.CSSProperties
      }
      {...props}
    >
      <CropMarksLine
        className={stackedOnlyClassName}
        style={{ ...stackedLineStyle, top: -1 }}
      />
      <CropMarksLine
        className={cn(stackedOnlyClassName, stackedBottomClassName)}
        style={{ ...stackedLineStyle, bottom: -1 }}
      />
      {children}
    </div>
  )
}

export {
  CropMarks,
  CropMarksCard,
  CropMarksGrid,
  CropMarksGridItem,
  CropMarksLine,
  deriveCropMarksGridLines,
  type CropMarksCardProps,
  type CropMarksGridBreakpoint,
  type CropMarksGridItemProps,
  type CropMarksGridLine,
  type CropMarksGridProps,
  type CropMarksGridTip,
  type CropMarksLayers,
  type CropMarksLineFade,
  type CropMarksLineProps,
  type CropMarksProps,
}
