import { Stats01 } from "@/components/blocks/stats-01/stats-01"

/*
 * The Stats 01 block: tile size follows importance, so the row line
 * between the two stacked tiles runs into the hero and stops at its
 * edge at full strength; only tips into open space fade.
 */
export default function CropMarksBentoTwoRowDemo() {
  return (
    <div className="flex w-full items-center justify-center p-12 sm:p-16">
      <Stats01 />
    </div>
  )
}
