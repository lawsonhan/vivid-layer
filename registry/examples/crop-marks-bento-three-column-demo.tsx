import {
  CropMarksGrid,
  CropMarksGridItem,
} from "@/components/ui/crop-marks"

/*
 * Three columns, two rows. The outer tiles span both rows, so the
 * middle column's row lines cross the gutters and stop at those
 * tiles at full strength; only tips into empty space fade.
 */
export default function CropMarksBentoThreeColumnDemo() {
  return (
    <div className="flex w-full items-center justify-center p-12 sm:p-16">
      <CropMarksGrid
        areas={["a b c", "a d c"]}
        overshoot={48}
        className="w-full auto-rows-[8rem] md:grid-rows-[repeat(2,18rem)]"
      >
        <CropMarksGridItem area="a">
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Spans both rows
            </p>
          </div>
        </CropMarksGridItem>
        <CropMarksGridItem area="b">
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Top
            </p>
          </div>
        </CropMarksGridItem>
        <CropMarksGridItem area="c">
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Spans both rows
            </p>
          </div>
        </CropMarksGridItem>
        <CropMarksGridItem area="d">
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Row lines stop here
            </p>
          </div>
        </CropMarksGridItem>
      </CropMarksGrid>
    </div>
  )
}
