import {
  CropMarksGrid,
  CropMarksGridItem,
} from "@/components/ui/crop-marks"

/*
 * Halves over thirds. The rows share no gutter, so every column
 * line belongs to one row only and stops at the tile above or
 * below it.
 */
export default function CropMarksBentoTwoRowThreeColumnDemo() {
  return (
    <div className="flex w-full items-center justify-center p-12 sm:p-16">
      <CropMarksGrid
        areas={["a a a b b b", "c c d d e e"]}
        overshoot={48}
        className="w-full auto-rows-[8rem] md:grid-rows-[repeat(2,18rem)]"
      >
        <CropMarksGridItem area="a">
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Half
            </p>
          </div>
        </CropMarksGridItem>
        <CropMarksGridItem area="b">
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Half
            </p>
          </div>
        </CropMarksGridItem>
        <CropMarksGridItem area="c">
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Third
            </p>
          </div>
        </CropMarksGridItem>
        <CropMarksGridItem area="d">
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Third
            </p>
          </div>
        </CropMarksGridItem>
        <CropMarksGridItem area="e">
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Third
            </p>
          </div>
        </CropMarksGridItem>
      </CropMarksGrid>
    </div>
  )
}
