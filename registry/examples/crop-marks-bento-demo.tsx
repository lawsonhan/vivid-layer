import {
  CropMarks,
  CropMarksCard,
} from "@/components/ui/crop-marks"

/*
 * In a grid, give every tile single-layer marks: each card draws one
 * line per edge, and the shared gaps stack neighboring lines into the
 * double-line divisions — no axis is ever drawn twice.
 */
export default function CropMarksBentoDemo() {
  return (
    <div className="flex h-[26rem] w-full items-center justify-center p-10 sm:p-14">
      <div className="grid w-full max-w-xl grid-cols-2 gap-8">
        <CropMarks className="col-span-2" layers="single" overshoot={32}>
          <CropMarksCard className="flex h-24 items-center justify-center p-6">
            <p className="text-sm text-muted-foreground">
              Every tile draws one line per edge.
            </p>
          </CropMarksCard>
        </CropMarks>
        <CropMarks layers="single" overshoot={32}>
          <CropMarksCard className="flex h-24 items-center justify-center p-6">
            <p className="text-center text-sm text-muted-foreground">
              The gaps pair them up.
            </p>
          </CropMarksCard>
        </CropMarks>
        <CropMarks layers="single" overshoot={32}>
          <CropMarksCard className="flex h-24 items-center justify-center p-6">
            <p className="text-center text-sm text-muted-foreground">
              No axis is drawn twice.
            </p>
          </CropMarksCard>
        </CropMarks>
      </div>
    </div>
  )
}
