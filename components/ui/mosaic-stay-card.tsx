"use client"

import * as React from "react"
import { ImageOffIcon, StarIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type MosaicStayCardImage = {
  src: string
  alt: string
}

type MosaicStayCardProps = Omit<
  React.ComponentProps<typeof Card>,
  "children" | "size"
> & {
  images: readonly MosaicStayCardImage[]
  href: string
  title: string
  address: string
  description: string
  rating?: number
}

const mosaicImageSlotClasses = [
  "row-span-2 rounded-l-2xl",
  "rounded-tr-2xl",
  "rounded-br-2xl",
] as const

function MosaicStayCard({
  images,
  href,
  title,
  address,
  description,
  rating,
  className,
  ...props
}: MosaicStayCardProps) {
  const [failedImageSources, setFailedImageSources] = React.useState(
    () => new Set<string>()
  )

  function handleImageError(src: string) {
    setFailedImageSources((currentSources) => {
      if (currentSources.has(src)) return currentSources

      const nextSources = new Set(currentSources)
      nextSources.add(src)
      return nextSources
    })
  }

  return (
    <Card
      {...props}
      data-component="mosaic-stay-card"
      className={cn(
        "gap-0 rounded-3xl py-0 [--card-spacing:--spacing(4)]",
        className
      )}
    >
      <div
        role="group"
        aria-label={`${title} image gallery`}
        className="grid min-h-0 aspect-[5/4] grid-cols-[2fr_1fr] grid-rows-2 gap-1 overflow-hidden p-2 pb-0"
      >
        {mosaicImageSlotClasses.map((slotClassName, index) => {
          const image = images[index]

          return (
            <div
              key={image ? `${image.src}-${index}` : index}
              className={cn(
                "min-h-0 overflow-hidden bg-muted",
                slotClassName
              )}
            >
              {image ? (
                <a
                  href={href}
                  aria-label={`View ${title}, image ${index + 1} of ${Math.min(images.length, 3)}`}
                  className="block size-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
                >
                  {!failedImageSources.has(image.src) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={image.src}
                      alt={image.alt}
                      width={960}
                      height={720}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                      onError={() => handleImageError(image.src)}
                    />
                  ) : (
                    <ImagePlaceholder title={title} />
                  )}
                </a>
              ) : (
                <ImagePlaceholder title={title} />
              )}
            </div>
          )
        })}
      </div>

      <CardContent className="mt-3 flex flex-col gap-1 pb-(--card-spacing)">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <h3 className="min-w-0 text-base leading-snug font-medium">
              <a
                href={href}
                className="line-clamp-1 rounded-sm outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {title}
              </a>
            </h3>
            {rating !== undefined && (
              <p className="flex shrink-0 items-center gap-1 text-sm leading-none">
                <span className="sr-only">
                  {rating} out of 5 stars
                </span>
                <StarIcon
                  className="size-4 fill-current text-orange-400"
                  aria-hidden="true"
                />
                <span className="font-medium" aria-hidden="true">
                  {rating}
                </span>
              </p>
            )}
          </div>
          <p className="truncate text-xs leading-4 text-muted-foreground">
            {address}
          </p>
        </div>

        <Separator className="data-horizontal:w-14" />

        <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

function ImagePlaceholder({ title }: { title: string }) {
  return (
    <div
      role="img"
      aria-label={`No image available for ${title}`}
      className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground"
    >
      <ImageOffIcon className="size-6" aria-hidden="true" />
      <span className="text-xs font-medium">Image unavailable</span>
    </div>
  )
}

export {
  MosaicStayCard,
  type MosaicStayCardImage,
  type MosaicStayCardProps,
}
