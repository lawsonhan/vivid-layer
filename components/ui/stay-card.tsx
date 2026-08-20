"use client"

import * as React from "react"
import {
  BedDoubleIcon,
  ImageOffIcon,
  MapPinIcon,
  RulerIcon,
  StarIcon,
} from "lucide-react"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

type StayCardImage = {
  src: string
  alt: string
}

type StayCardProps = Omit<
  React.ComponentProps<"article">,
  "children"
> & {
  images: readonly StayCardImage[]
  href: string
  title: string
  location: string
  beds?: number
  squareFeet?: number
  price: string
  priceSuffix?: string
  rating?: number
  reviewCount?: number
}

function StayCard({
  images,
  href,
  title,
  location,
  beds,
  squareFeet,
  price,
  priceSuffix = "/ night",
  rating,
  reviewCount,
  className,
  ...props
}: StayCardProps) {
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

  const ratingSummary = [
    rating !== undefined ? `${rating} out of 5 stars` : undefined,
    reviewCount !== undefined
      ? `${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}`
      : undefined,
  ]
    .filter(Boolean)
    .join(", ")

  return (
    <article
      {...props}
      data-component="stay-card"
      className={cn("group relative min-w-0", className)}
    >
      <Carousel
        aria-label={`${title} image gallery`}
        className="group/carousel [&_[data-slot=carousel-content]]:rounded-xl"
        opts={{ loop: images.length > 1 }}
      >
        <CarouselContent className="ml-0">
          {images.length > 0 ? (
            images.map((image, index) => (
              <CarouselItem
                key={`${image.src}-${index}`}
                aria-label={`${index + 1} of ${images.length}`}
                className="pl-0"
              >
                <a
                  href={href}
                  aria-label={`View ${title}, image ${index + 1} of ${images.length}`}
                  className="block aspect-[12/11] bg-muted outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
                >
                  {!failedImageSources.has(image.src) ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={image.src}
                      alt={image.alt}
                      width={640}
                      height={480}
                      loading="lazy"
                      decoding="async"
                      className="size-full object-cover"
                      onError={() => handleImageError(image.src)}
                    />
                  ) : (
                    <div
                      role="img"
                      aria-label={`No image available for ${title}`}
                      className="flex size-full flex-col items-center justify-center gap-2 text-muted-foreground"
                    >
                      <ImageOffIcon
                        className="size-6"
                        aria-hidden="true"
                      />
                      <span className="text-xs font-medium">
                        Image unavailable
                      </span>
                    </div>
                  )}
                </a>
              </CarouselItem>
            ))
          ) : (
            <CarouselItem
              aria-label="No image available"
              className="pl-0"
            >
              <div
                role="img"
                aria-label={`No image available for ${title}`}
                className="flex aspect-[12/11] flex-col items-center justify-center gap-2 bg-muted text-muted-foreground"
              >
                <ImageOffIcon className="size-6" aria-hidden="true" />
                <span className="text-xs font-medium">
                  Image unavailable
                </span>
              </div>
            </CarouselItem>
          )}
        </CarouselContent>

        {images.length > 1 && (
          <>
            <CarouselPrevious
              variant="secondary"
              className="pointer-events-none left-2 bg-secondary/90 opacity-0 shadow-sm ring-1 ring-foreground/10 backdrop-blur-sm transition-opacity hover:bg-secondary group-hover/carousel:pointer-events-auto group-hover/carousel:opacity-100 group-focus-within/carousel:pointer-events-auto group-focus-within/carousel:opacity-100 motion-reduce:transition-none"
            />
            <CarouselNext
              variant="secondary"
              className="pointer-events-none right-2 bg-secondary/90 opacity-0 shadow-sm ring-1 ring-foreground/10 backdrop-blur-sm transition-opacity hover:bg-secondary group-hover/carousel:pointer-events-auto group-hover/carousel:opacity-100 group-focus-within/carousel:pointer-events-auto group-focus-within/carousel:opacity-100 motion-reduce:transition-none"
            />
          </>
        )}
      </Carousel>

      <div className="mt-3 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          {(beds !== undefined || squareFeet !== undefined) && (
            <p className="flex items-center gap-3 text-sm text-muted-foreground">
              {beds !== undefined && (
                <span className="flex items-center gap-1.5">
                  <BedDoubleIcon
                    className="size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    {beds} {beds === 1 ? "bed" : "beds"}
                  </span>
                </span>
              )}
              {squareFeet !== undefined && (
                <span className="flex items-center gap-1.5">
                  <RulerIcon
                    className="size-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span>
                    {squareFeet.toLocaleString("en-US")} sq ft
                  </span>
                </span>
              )}
            </p>
          )}
          <div className="flex flex-col gap-1">
            <h3 className="text-base leading-snug font-medium">
              <a
                href={href}
                className="line-clamp-1 rounded-sm outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                {title}
              </a>
            </h3>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPinIcon
                className="size-3.5 shrink-0"
                aria-hidden="true"
              />
              <span className="truncate">{location}</span>
            </p>
          </div>
        </div>

        <Separator className="data-horizontal:w-14" />

        <div className="flex items-center justify-between gap-2">
          <p className="flex min-w-0 items-baseline">
            <span className="text-base font-medium">{price}</span>
            {priceSuffix && (
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                {priceSuffix}
              </span>
            )}
          </p>

          {(rating !== undefined || reviewCount !== undefined) && (
            <p className="relative flex shrink-0 items-center gap-1 text-sm leading-none">
              <span className="sr-only">{ratingSummary}</span>
              {rating !== undefined && (
                <>
                  <StarIcon
                    className="size-4 fill-current text-orange-400"
                    aria-hidden="true"
                  />
                  <span className="font-medium" aria-hidden="true">
                    {rating}
                  </span>
                </>
              )}
              {reviewCount !== undefined && (
                <span
                  className="text-muted-foreground"
                  aria-hidden="true"
                >
                  ({reviewCount})
                </span>
              )}
            </p>
          )}
        </div>
      </div>
    </article>
  )
}

export { StayCard, type StayCardImage, type StayCardProps }
