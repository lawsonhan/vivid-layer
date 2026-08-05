import {
  GridLoader,
  type GridLoaderVariant,
} from "@/components/ui/grid-loader"

const variants: readonly GridLoaderVariant[] = [
  "sweep",
  "trace",
  "spiral",
  "ribbon",
  "classifying",
  "orbit",
]

export default function GridLoaderDemo() {
  return (
    <div className="w-full overflow-x-auto p-6 sm:p-8">
      <div className="mx-auto flex w-max items-start gap-6">
        {variants.map((variant) => (
          <figure
            className="flex w-16 shrink-0 flex-col items-center gap-2"
            key={variant}
          >
            <div className="flex size-8 items-center justify-center">
              <GridLoader dotSize={2} size={24} variant={variant} />
            </div>
            <figcaption className="text-center font-mono text-[0.6875rem] leading-4 text-muted-foreground">
              {variant}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  )
}
