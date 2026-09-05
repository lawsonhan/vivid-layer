import { CropMarksCard, CropMarksLine } from "@/components/ui/crop-marks"

/*
 * The collage arrangement: staggered tiles no regular grid describes,
 * so each shared axis is drawn once by hand with CropMarksLine. The
 * right column owns its two side lines; every horizontal line that
 * meets a neighbor reaches exactly across the 2rem gutter and keeps
 * that tip full-strength (fade only the open tip), while lines that
 * run into empty space overshoot 4rem, fade over that same distance
 * (--crop-marks-fade), and are clipped by the stage so the marks appear
 * to run off every edge.
 */
export default function CropMarksMessyBentoDemo() {
  return (
    <div className="flex h-[36rem] w-full items-center justify-center overflow-hidden px-8 py-6 [--crop-marks-fade:4rem]">
      <div className="flex w-full items-start gap-8">
        <div className="relative mt-12 min-w-0 flex-1">
          <CropMarksLine
            className="-top-px -left-16 w-[calc(100%+6rem)]"
            fade="start"
          />
          <CropMarksLine
            className="-bottom-px -left-16 w-[calc(100%+6rem)]"
            fade="start"
          />
          <CropMarksLine
            axis="vertical"
            className="-top-16 -left-px h-[calc(100%+8rem)]"
          />
          <CropMarksLine
            axis="vertical"
            className="-top-16 -right-px h-[calc(100%+8rem)]"
          />
          <CropMarksCard className="flex h-80 items-center justify-center p-6">
            <p className="text-center text-sm text-muted-foreground">
              Stagger the tiles and the crossings drift.
            </p>
          </CropMarksCard>
        </div>
        <div className="relative flex w-2/5 flex-none flex-col gap-8">
          <CropMarksLine
            axis="vertical"
            className="-top-16 -left-px h-[calc(100%+8rem)]"
          />
          <CropMarksLine
            axis="vertical"
            className="-top-16 -right-px h-[calc(100%+8rem)]"
          />
          <div className="relative">
            <CropMarksLine className="-top-px -left-16 w-[calc(100%+8rem)]" />
            <CropMarksLine
              className="-bottom-px -left-8 w-[calc(100%+6rem)]"
              fade="end"
            />
            <CropMarksCard className="flex h-44 items-center justify-center p-6">
              <p className="text-center text-sm text-muted-foreground">
                Off-grid.
              </p>
            </CropMarksCard>
          </div>
          <div className="relative">
            <CropMarksLine
              className="-top-px -left-8 w-[calc(100%+6rem)]"
              fade="end"
            />
            <CropMarksLine
              className="-bottom-px -left-16 w-[calc(100%+8rem)]"
            />
            <CropMarksCard className="flex h-64 items-center justify-center p-6">
              <p className="text-center text-sm text-muted-foreground">
                Lines run off the stage.
              </p>
            </CropMarksCard>
          </div>
        </div>
      </div>
    </div>
  )
}
