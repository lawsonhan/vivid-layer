import { Features01 } from "@/components/blocks/features-01/features-01"

/*
 * The Features 01 block: the intro and the artwork span both rows, so
 * the row lines between the two feature tiles stop at them at full
 * strength; only tips into empty space fade.
 */
export default function CropMarksBentoThreeColumnDemo() {
  return (
    <div className="flex w-full items-center justify-center p-12 sm:p-16">
      <Features01 />
    </div>
  )
}
