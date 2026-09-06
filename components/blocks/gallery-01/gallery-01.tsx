import { CropMarksLine } from "@/components/ui/crop-marks"

function GalleryTile({
  alt,
  className,
  number,
  src,
  title,
}: {
  alt: string
  className: string
  number: string
  src: string
  title: string
}) {
  return (
    <figure className={className}>
      <div className="relative min-h-0 flex-1">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={alt}
          className="absolute inset-0 size-full object-cover"
          src={src}
        />
      </div>
      <figcaption className="flex items-baseline justify-between px-1 pt-3 text-sm">
        <span className="font-medium">{title}</span>
        <span className="text-muted-foreground">{number}</span>
      </figcaption>
    </figure>
  )
}

/**
 * A gallery collage: staggered tiles no regular grid describes, so each
 * shared axis is drawn once by hand with CropMarksLine. The right column
 * owns its two side lines; every horizontal line that meets a neighbor
 * reaches exactly across the 2rem gutter and keeps that tip
 * full-strength (fade only the open tip), while lines that run into
 * empty space overshoot 4rem, fade over that same distance
 * (--crop-marks-fade), and are clipped by the stage so the marks appear
 * to run off every edge. The stage is part of the block.
 */
export function Gallery01() {
  return (
    <div className="flex h-[36rem] w-full items-center justify-center overflow-hidden px-8 py-6 [--crop-marks-fade:4rem]">
      <div className="flex w-full items-start gap-8">
        <div className="relative mt-12 min-w-0 flex-1">
          <CropMarksLine
            className="-top-px -left-16 w-[calc(100%+6rem)]"
            fade="start"
          />
          <CropMarksLine
            className="-bottom-px -left-16 w-[calc(100%+6rem)]"
            fade="start"
          />
          <CropMarksLine
            axis="vertical"
            className="-top-16 -left-px h-[calc(100%+8rem)]"
          />
          <CropMarksLine
            axis="vertical"
            className="-top-16 -right-px h-[calc(100%+8rem)]"
          />
          <GalleryTile
            alt="Metaballs shader render"
            className="flex h-80 flex-col"
            number="No. 01"
            src="/shader-posters/metaballs.webp"
            title="Metaballs"
          />
        </div>
        <div className="relative flex w-2/5 flex-none flex-col gap-8">
          <CropMarksLine
            axis="vertical"
            className="-top-16 -left-px h-[calc(100%+8rem)]"
          />
          <CropMarksLine
            axis="vertical"
            className="-top-16 -right-px h-[calc(100%+8rem)]"
          />
          <div className="relative">
            <CropMarksLine className="-top-px -left-16 w-[calc(100%+8rem)]" />
            <CropMarksLine
              className="-bottom-px -left-8 w-[calc(100%+6rem)]"
              fade="end"
            />
            <GalleryTile
              alt="Grain gradient shader render"
              className="flex h-44 flex-col"
              number="No. 02"
              src="/shader-posters/grain-gradient.webp"
              title="Grain gradient"
            />
          </div>
          <div className="relative">
            <CropMarksLine
              className="-top-px -left-8 w-[calc(100%+6rem)]"
              fade="end"
            />
            <CropMarksLine
              className="-bottom-px -left-16 w-[calc(100%+8rem)]"
            />
            <GalleryTile
              alt="Mesh gradient shader render"
              className="flex h-64 flex-col"
              number="No. 03"
              src="/shader-posters/mesh-gradient.webp"
              title="Mesh gradient"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
