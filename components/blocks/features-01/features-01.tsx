import { ChartNoAxesCombinedIcon, UsersIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  CropMarksGrid,
  CropMarksGridItem,
} from "@/components/ui/crop-marks"

const noisePattern = `url("data:image/svg+xml;charset=utf-8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="250" height="250" viewBox="0 0 100 100">
    <filter id="n">
      <feTurbulence type="turbulence" baseFrequency="1.4" numOctaves="1" seed="2" stitchTiles="stitch" result="n" />
      <feComponentTransfer result="g">
        <feFuncR type="linear" slope="2.4" intercept="-0.7" />
        <feFuncG type="linear" slope="2.4" intercept="-0.7" />
        <feFuncB type="linear" slope="2.4" intercept="-0.7" />
      </feComponentTransfer>
      <feColorMatrix type="saturate" values="0" in="g" />
    </filter>
    <rect width="100%" height="100%" filter="url(#n)" />
  </svg>`.replace(/\s+/g, " ")
)}")`

/**
 * A feature section on a Crop Marks bento: the intro and the product
 * artwork span both rows, and two feature tiles sit between them. Give
 * the parent room for the marks' overshoot (no overflow-hidden nearby).
 */
export function Features01() {
  return (
    <CropMarksGrid
      areas={["a b c", "a d c"]}
      overshoot={48}
      className="w-full md:grid-rows-[repeat(2,minmax(11rem,auto))]"
    >
      <CropMarksGridItem area="a">
        <div className="flex flex-1 flex-col justify-between gap-8 px-6 py-4">
          <div className="flex flex-col gap-3">
            <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Vivid Layer
            </p>
            <h3 className="text-2xl font-semibold tracking-tight">
              Your work, in view.
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Projects, tasks, and team updates in one place. Keep your next
              milestone in sight.
            </p>
          </div>
          <Button className="w-fit" variant="outline">
            Explore workspace
          </Button>
        </div>
      </CropMarksGridItem>
      <CropMarksGridItem area="b">
        <div className="flex flex-1 flex-col gap-2 px-6 py-4">
          <ChartNoAxesCombinedIcon aria-hidden="true" className="size-5" />
          <h4 className="font-medium">See the bigger picture</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Track progress, spot blockers, and give every project a clear
            path from first idea to launch.
          </p>
        </div>
      </CropMarksGridItem>
      <CropMarksGridItem area="d">
        <div className="flex flex-1 flex-col gap-2 px-6 py-4">
          <UsersIcon aria-hidden="true" className="size-5" />
          <h4 className="font-medium">Move forward together</h4>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Keep owners, priorities, and conversations close to the work, so
            everyone knows what comes next.
          </p>
        </div>
      </CropMarksGridItem>
      <CropMarksGridItem area="c">
        <div className="relative min-h-80 flex-1 overflow-hidden bg-[linear-gradient(135deg,#6b95e6_0%,#a9c0ea_30%,#cfd6e2_65%,#d4d4d8_100%)] dark:bg-[linear-gradient(135deg,#3557a8_0%,#2b3f6e_30%,#252d40_62%,#27272a_100%)]">
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-55 mix-blend-overlay"
            style={{
              backgroundPosition: "center",
              backgroundImage: noisePattern,
            }}
          />
          <div className="absolute inset-0 pt-(--padding) pl-(--padding) [--padding:min(16%,--spacing(16))]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Vivid Layer light-mode support dashboard with a shared inbox, customer conversation, and assistant panel"
              className="relative h-[calc(100%*1990/800)] w-[calc(100%*3440/1000)] max-w-none origin-top-left scale-125 rounded-tl-[2px] bg-white/75 object-cover object-left-top ring-1 ring-black/10 sm:h-[calc(100%*1990/660)] sm:w-[calc(100%*3440/1800)] lg:h-[calc(100%*1990/1300)] lg:w-[calc(100%*3440/1300)] xl:h-[calc(100%*1990/1250)] xl:w-[calc(100%*3440/1800)]"
              src="/component-assets/vivid-layer-inbox.png"
            />
          </div>
        </div>
      </CropMarksGridItem>
    </CropMarksGrid>
  )
}
