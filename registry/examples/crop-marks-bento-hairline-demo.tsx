import {
  CropMarksGrid,
  CropMarksGridItem,
} from "@/components/ui/crop-marks"

/*
 * Tiles that touch, like a pricing table: with a single layer each
 * hairline gutter carries one line instead of the pair, and the seam
 * between the small tiles still stops where the large tile spans it.
 */
export default function CropMarksBentoHairlineDemo() {
  return (
    <div className="flex w-full items-center justify-center p-12 sm:p-16">
      <CropMarksGrid
        areas={["a a b c", "a a d e"]}
        layers="single"
        gap={1}
        overshoot={48}
        className="w-full auto-rows-[8rem] md:grid-rows-[repeat(2,14rem)]"
      >
        <CropMarksGridItem area="a">
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Spans two columns and both rows
            </p>
          </div>
        </CropMarksGridItem>
        <CropMarksGridItem area="b">
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Cell
            </p>
          </div>
        </CropMarksGridItem>
        <CropMarksGridItem area="c">
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Cell
            </p>
          </div>
        </CropMarksGridItem>
        <CropMarksGridItem area="d">
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Cell
            </p>
          </div>
        </CropMarksGridItem>
        <CropMarksGridItem area="e">
          <div className="flex flex-1 items-center justify-center p-4">
            <p className="text-center text-sm text-muted-foreground">
              Cell
            </p>
          </div>
        </CropMarksGridItem>
      </CropMarksGrid>
    </div>
  )
}
