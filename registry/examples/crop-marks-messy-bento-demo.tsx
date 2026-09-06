import { Gallery01 } from "@/components/blocks/gallery-01/gallery-01"

/*
 * The Gallery 01 block: staggered tiles no regular grid describes, so
 * each shared axis is drawn once by hand with CropMarksLine and the
 * overshooting marks are clipped by the block's own stage.
 */
export default function CropMarksMessyBentoDemo() {
  return <Gallery01 />
}
