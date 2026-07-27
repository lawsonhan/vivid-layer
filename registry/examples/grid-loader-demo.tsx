import {
  GridLoader,
  type GridLoaderVariant,
} from "@/components/ui/grid-loader"

const variants: readonly {
  label: string
  variant: GridLoaderVariant
}[] = [
  { label: "grid-loader-sweep", variant: "sweep" },
  { label: "grid-loader-trace", variant: "trace" },
  { label: "grid-loader-spiral", variant: "spiral" },
  { label: "grid-loader-ribbon", variant: "ribbon" },
  { label: "grid-loader-classifying", variant: "classifying" },
  { label: "grid-loader-orbit", variant: "orbit" },
]

export default function GridLoaderDemo() {
  return (
    <div className="grid w-full grid-cols-1 place-items-center gap-x-8 gap-y-12 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-3 lg:p-12">
      {variants.map(({ label, variant }) => (
        <figure
          className="flex min-w-0 flex-col items-center gap-5"
          key={variant}
        >
          <div className="flex size-36 items-center justify-center">
            <GridLoader
              dotSize={2}
              size={16}
              style={{ transform: "scale(9)" }}
              variant={variant}
            />
          </div>
          <figcaption className="max-w-36 break-words text-center font-mono text-[0.6875rem] leading-4 text-muted-foreground">
            {label}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
