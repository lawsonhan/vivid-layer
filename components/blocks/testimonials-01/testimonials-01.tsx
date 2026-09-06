import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  CropMarksGrid,
  CropMarksGridItem,
} from "@/components/ui/crop-marks"

const testimonials = [
  {
    area: "a",
    featured: true,
    quote:
      "We replaced a week of custom WebGL with two registry installs. The presets alone covered every page of the launch.",
    name: "Mara Lindqvist",
    role: "Design lead, Fathom",
    avatar: "https://i.pravatar.cc/150?img=47",
  },
  {
    area: "b",
    featured: true,
    quote:
      "Every component arrived as one readable file. We edited the source instead of fighting a theme API.",
    name: "Daniel Okafor",
    role: "Frontend engineer, Relay",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    area: "c",
    featured: false,
    quote: "The crop marks became our whole visual language.",
    name: "Sofia Marin",
    role: "Founder, Studio Ninefold",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    area: "d",
    featured: false,
    quote: "Install, open the file, change three lines. That was the integration.",
    name: "Jonas Weber",
    role: "Product, Harbor",
    avatar: "https://i.pravatar.cc/150?img=68",
  },
  {
    area: "e",
    featured: false,
    quote: "Finally a registry whose demos look like real pages.",
    name: "Priya Natarajan",
    role: "Staff engineer, Meridian",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
]

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
}

/** A solid double quotation mark with rounded corners and curved tails. */
function QuoteMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M3.75 4h4.5A1.75 1.75 0 0 1 10 5.75V12c0 4.14-2.64 7.5-6.42 8a.97.97 0 0 1-1.08-.87l-.12-1.27a.98.98 0 0 1 .77-1.04C5.02 16.44 6.27 15.02 6.5 13H3.75A1.75 1.75 0 0 1 2 11.25v-5.5A1.75 1.75 0 0 1 3.75 4Zm12 0h4.5A1.75 1.75 0 0 1 22 5.75V12c0 4.14-2.64 7.5-6.42 8a.97.97 0 0 1-1.08-.87l-.12-1.27a.98.98 0 0 1 .77-1.04c1.87-.38 3.12-1.8 3.35-3.82h-2.75A1.75 1.75 0 0 1 14 11.25v-5.5A1.75 1.75 0 0 1 15.75 4Z" />
    </svg>
  )
}

/**
 * A testimonials section on a Crop Marks bento: two featured quotes over
 * three short ones, each with a quote mark and an avatar. Give the
 * parent room for the marks' overshoot.
 */
export function Testimonials01() {
  return (
    <CropMarksGrid
      areas={["a a a b b b", "c c d d e e"]}
      overshoot={48}
      className="w-full md:grid-rows-[minmax(14rem,auto)_minmax(10rem,auto)]"
    >
      {testimonials.map((item) => (
        <CropMarksGridItem area={item.area} key={item.area}>
          <figure className="relative flex flex-1 flex-col justify-between gap-6 p-6">
            <QuoteMark
              className={
                item.featured
                  ? "absolute top-5 right-5 size-8 text-muted-foreground/25"
                  : "absolute top-5 right-5 size-5 text-muted-foreground/25"
              }
            />
            <blockquote
              className={
                item.featured
                  ? "pr-12 text-xl leading-snug font-medium tracking-tight"
                  : "pr-8 text-sm leading-relaxed"
              }
            >
              {item.quote}
            </blockquote>
            <figcaption className="flex items-center gap-3">
              <Avatar size={item.featured ? "lg" : "default"}>
                <AvatarImage alt={item.name} src={item.avatar} />
                <AvatarFallback>{initials(item.name)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold tracking-tight">
                  {item.name}
                </span>
                <span className="text-xs text-muted-foreground">
                  {item.role}
                </span>
              </div>
            </figcaption>
          </figure>
        </CropMarksGridItem>
      ))}
    </CropMarksGrid>
  )
}
