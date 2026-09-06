import { Testimonials01 } from "@/components/blocks/testimonials-01/testimonials-01"

/*
 * The Testimonials 01 block: the rows share no gutter, so every column
 * line belongs to one row only and stops at the tile above or below it.
 */
export default function CropMarksBentoTwoRowThreeColumnDemo() {
  return (
    <div className="flex w-full items-center justify-center p-12 sm:p-16">
      <Testimonials01 />
    </div>
  )
}
