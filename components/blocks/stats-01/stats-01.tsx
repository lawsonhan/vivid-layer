"use client"

import { ArrowUpRightIcon } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { Badge } from "@/components/ui/badge"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  CropMarksGrid,
  CropMarksGridItem,
} from "@/components/ui/crop-marks"

const installs = [
  { month: "Jan", installs: 1240 },
  { month: "Feb", installs: 1480 },
  { month: "Mar", installs: 1390 },
  { month: "Apr", installs: 1760 },
  { month: "May", installs: 1980 },
  { month: "Jun", installs: 2410 },
]

const installsConfig = {
  installs: { label: "Installs", color: "#5b8def" },
} satisfies ChartConfig

const registry = [
  { name: "Components", count: 11, className: "bg-[#5b8def]" },
  { name: "Shaders", count: 26, className: "bg-muted-foreground/30" },
]
const registryTotal = registry.reduce((sum, part) => sum + part.count, 0)

const uptime = Array.from({ length: 13 }, (_, index) => ({
  week: index + 1,
  incident: index === 8,
}))

/**
 * A metrics section on a Crop Marks bento: the hero tile spans both
 * rows with the headline figure and its trend chart, and the two tiles
 * stacked beside it each pair one number with a small visual — a total
 * over its breakdown bar, a rate over its weekly tracker. Every tile
 * shares the same anatomy: label and value at the top, the visual
 * pinned to the bottom. Three columns keep the side tiles readable
 * from a 560px docs frame up to a full content column. Give the parent
 * room for the marks' overshoot.
 */
export function Stats01() {
  return (
    <CropMarksGrid
      areas={["a a b", "a a c"]}
      overshoot={48}
      className="w-full max-w-4xl md:grid-rows-[repeat(2,minmax(0,1fr))]"
    >
      <CropMarksGridItem area="a">
        <div className="flex flex-1 flex-col gap-5 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-sm font-medium text-muted-foreground">
                Installs
              </h3>
              <div className="flex items-center gap-3">
                <span className="text-4xl font-semibold tracking-tight md:text-5xl">
                  2.4M
                </span>
                <Badge variant="secondary">
                  <ArrowUpRightIcon aria-hidden="true" />
                  18%
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                vs. the previous six months
              </p>
            </div>
            <span className="text-xs whitespace-nowrap text-muted-foreground">
              Jan – Jun
            </span>
          </div>
          <ChartContainer
            className="mt-auto aspect-auto min-h-36 w-full flex-1"
            config={installsConfig}
          >
            <AreaChart
              accessibilityLayer
              data={installs}
              margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
            >
              <defs>
                <linearGradient
                  id="stats-01-installs-gradient"
                  x1="0"
                  x2="0"
                  y1="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor="var(--color-installs)"
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-installs)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                axisLine={false}
                dataKey="month"
                interval={0}
                padding={{ left: 12, right: 12 }}
                tickLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                content={<ChartTooltipContent indicator="dot" />}
                cursor={false}
              />
              <Area
                dataKey="installs"
                fill="url(#stats-01-installs-gradient)"
                stroke="var(--color-installs)"
                strokeWidth={2}
                type="monotone"
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </CropMarksGridItem>
      <CropMarksGridItem area="b">
        <div className="flex flex-1 flex-col justify-between gap-5 p-5">
          <div className="flex flex-col gap-1.5">
            <h3 className="text-sm font-medium text-muted-foreground">
              In the registry
            </h3>
            <span className="text-2xl font-semibold tracking-tight">
              {registryTotal}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <div
              aria-hidden="true"
              className="flex h-2 w-full gap-0.5 overflow-hidden rounded-full"
            >
              {registry.map((part) => (
                <div
                  className={`rounded-full ${part.className}`}
                  key={part.name}
                  style={{ width: `${(part.count / registryTotal) * 100}%` }}
                />
              ))}
            </div>
            <dl className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              {registry.map((part) => (
                <div
                  className="flex items-center justify-between gap-3"
                  key={part.name}
                >
                  <dt className="flex items-center gap-1.5">
                    <span
                      aria-hidden="true"
                      className={`size-2 rounded-full ${part.className}`}
                    />
                    {part.name}
                  </dt>
                  <dd className="font-medium text-foreground">{part.count}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </CropMarksGridItem>
      <CropMarksGridItem area="c">
        <div className="flex flex-1 flex-col justify-between gap-5 p-5">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                Uptime
              </h3>
              <span className="text-xs whitespace-nowrap text-muted-foreground">
                13 weeks
              </span>
            </div>
            <span className="text-2xl font-semibold tracking-tight">
              99.98%
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <div
              aria-hidden="true"
              className="flex h-5 w-full gap-0.5 overflow-hidden rounded-[3px]"
            >
              {uptime.map((week) => (
                <div
                  className={`flex-1 rounded-[2px] ${
                    week.incident ? "bg-muted-foreground/30" : "bg-[#5b8def]"
                  }`}
                  key={week.week}
                />
              ))}
            </div>
            <dl className="flex flex-col gap-1.5 text-xs text-muted-foreground">
              <div className="flex items-center justify-between gap-3">
                <dt className="flex items-center gap-1.5">
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full bg-muted-foreground/30"
                  />
                  Incidents
                </dt>
                <dd className="font-medium text-foreground">
                  {uptime.filter((week) => week.incident).length}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </CropMarksGridItem>
    </CropMarksGrid>
  )
}
