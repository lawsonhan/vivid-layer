import {
  CropMarks,
  type CropMarksProps,
} from "@/components/ui/crop-marks"

type CropMarksImageDemoProps = {
  cropMarksProps?: Pick<
    CropMarksProps,
    "layers" | "layerGap" | "overshoot" | "fade"
  >
}

export default function CropMarksImageDemo({
  cropMarksProps,
}: CropMarksImageDemoProps = {}) {
  return (
    <div className="flex h-[26rem] w-full items-center justify-center p-10 sm:p-14">
      <CropMarks className="w-full max-w-sm" {...cropMarksProps}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Snowy mountain range under a clear sky"
          className="aspect-[16/10] w-full rounded-xl object-cover"
          src="https://vivid-layer.com/shader-assets/snowy-mountains.03f2cd9f8cd5.webp"
        />
      </CropMarks>
    </div>
  )
}
