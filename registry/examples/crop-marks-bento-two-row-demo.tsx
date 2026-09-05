import {
  CropMarksCard,
  CropMarksGrid,
  CropMarksGridItem,
} from "@/components/ui/crop-marks"

/*
 * Two rows split four-two and two-four. Each row's gutter lines
 * run into the wide tile of the other row and stop at its edge,
 * while the other tip runs off the grid and fades.
 */
export default function CropMarksBentoTwoRowDemo() {
  return (
    <div className="flex w-full items-center justify-center p-12 sm:p-16">
      <CropMarksGrid
        areas={["a a a a b b", "c c d d d d"]}
        overshoot={48}
        className="w-full auto-rows-[8rem] md:grid-rows-[repeat(2,18rem)]"
      >
        <CropMarksGridItem area="a">
          <CropMarksCard className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Four columns
            </p>
          </CropMarksCard>
        </CropMarksGridItem>
        <CropMarksGridItem area="b">
          <CropMarksCard className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Two
            </p>
          </CropMarksCard>
        </CropMarksGridItem>
        <CropMarksGridItem area="c">
          <CropMarksCard className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Two
            </p>
          </CropMarksCard>
        </CropMarksGridItem>
        <CropMarksGridItem area="d">
          <CropMarksCard className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Four columns
            </p>
          </CropMarksCard>
        </CropMarksGridItem>
      </CropMarksGrid>
    </div>
  )
}
