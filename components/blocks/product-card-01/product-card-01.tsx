import {
  CropMarksGrid,
  CropMarksGridItem,
} from "@/components/ui/crop-marks"

const specs = [
  { area: "b", label: "Resolution", value: "5120 × 2880" },
  { area: "c", label: "Brightness", value: "600 nits" },
  { area: "d", label: "Refresh rate", value: "120 Hz" },
  { area: "e", label: "Ports", value: "3× Thunderbolt" },
]

/**
 * A product spec card on a hairline Crop Marks grid: the product tile
 * spans both rows beside four spec cells that touch across a 1px gap,
 * so a single layer draws one line per gutter like a table's rules.
 * Give the parent room for the marks' overshoot.
 */
export function ProductCard01() {
  return (
    <CropMarksGrid
      areas={["a a b c", "a a d e"]}
      layers="single"
      gap={1}
      overshoot={48}
      className="w-full md:grid-rows-[repeat(2,minmax(10rem,auto))]"
    >
      <CropMarksGridItem area="a">
        <div className="flex flex-1 flex-col">
          <div className="relative min-h-40 flex-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="Aurora Display silver monitor with a blue and violet screen"
              className="absolute inset-0 size-full object-cover"
              src="/component-assets/aurora-display.webp"
            />
          </div>
          <div className="flex items-baseline justify-between gap-4 p-4">
            <span className="font-medium">Aurora Display</span>
            <span className="text-sm text-muted-foreground">from $1,299</span>
          </div>
        </div>
      </CropMarksGridItem>
      {specs.map((spec) => (
        <CropMarksGridItem area={spec.area} key={spec.area}>
          <div className="flex flex-1 flex-col justify-center gap-1 p-5">
            <span className="text-xs tracking-wider text-muted-foreground uppercase">
              {spec.label}
            </span>
            <span className="text-lg font-medium">{spec.value}</span>
          </div>
        </CropMarksGridItem>
      ))}
    </CropMarksGrid>
  )
}
