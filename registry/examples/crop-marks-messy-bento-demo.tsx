import {
  CropMarks,
  CropMarksCard,
} from "@/components/ui/crop-marks"

/*
 * The collage arrangement: staggered single-layer tiles whose
 * overshooting lines cross at unequal heights, clipped by the stage
 * so the marks appear to run off every edge.
 */
export default function CropMarksMessyBentoDemo() {
  return (
    <div className="flex h-[26rem] w-full items-center justify-center overflow-hidden p-10 sm:p-14">
      <div className="flex w-full max-w-xl items-start gap-8">
        <CropMarks
          className="mt-12 min-w-0 flex-1"
          layers="single"
          overshoot={64}
        >
          <CropMarksCard className="flex h-44 items-center justify-center p-6">
            <p className="text-center text-sm text-muted-foreground">
              Stagger the tiles and the crossings drift.
            </p>
          </CropMarksCard>
        </CropMarks>
        <div className="flex w-2/5 flex-none flex-col gap-8">
          <CropMarks layers="single" overshoot={64}>
            <CropMarksCard className="flex h-24 items-center justify-center p-6">
              <p className="text-center text-sm text-muted-foreground">
                Off-grid.
              </p>
            </CropMarksCard>
          </CropMarks>
          <CropMarks layers="single" overshoot={64}>
            <CropMarksCard className="flex h-36 items-center justify-center p-6">
              <p className="text-center text-sm text-muted-foreground">
                Lines run off the stage.
              </p>
            </CropMarksCard>
          </CropMarks>
        </div>
      </div>
    </div>
  )
}
