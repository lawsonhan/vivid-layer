import { ColorDithering } from "@/components/effects/color-dithering"

const image = "/shader-assets/monument-valley.9a0e22e4434a.jpg"

const columns = [
  {
    title: "Product",
    links: ["Components", "Blocks", "Shaders", "Pricing"],
  },
  {
    title: "Resources",
    links: ["Documentation", "Registry", "Changelog", "Templates"],
  },
  {
    title: "Company",
    links: ["About", "Contact", "Careers"],
  },
] as const

const socials = [
  {
    label: "X",
    path: "M18.2 2H21l-6.6 7.6L22 22h-6.1l-4.8-6.3L5.6 22H2.8l7.1-8.1L2.4 2h6.3l4.3 5.7L18.2 2Zm-1.1 18.2h1.7L7.4 3.7H5.6l11.5 16.5Z",
  },
  {
    label: "GitHub",
    path: "M12 2a10 10 0 0 0-3.2 19.5c.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.3-3.4-1.3-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.2-4.6-1.1-4.6-4.9 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1a9.6 9.6 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.8-2.3 4.7-4.6 4.9.4.3.7.9.7 1.9V21c0 .3.2.6.7.5A10 10 0 0 0 12 2Z",
  },
  {
    label: "LinkedIn",
    path: "M20.4 2H3.6A1.6 1.6 0 0 0 2 3.6v16.8A1.6 1.6 0 0 0 3.6 22h16.8a1.6 1.6 0 0 0 1.6-1.6V3.6A1.6 1.6 0 0 0 20.4 2ZM8 19H5V9h3v10ZM6.5 7.7a1.7 1.7 0 1 1 0-3.4 1.7 1.7 0 0 1 0 3.4ZM19 19h-3v-4.9c0-1.2 0-2.7-1.6-2.7s-1.9 1.3-1.9 2.6V19h-3V9h2.9v1.4c.4-.8 1.4-1.6 2.9-1.6 3 0 3.6 2 3.6 4.6V19Z",
  },
] as const

/**
 * A footer that closes the page with the same photograph twice: darkened
 * and desaturated across the whole footer, and in full colour inside a
 * framed window as a fine newsprint screen, with the call to action on
 * top. The dithered dots leave transparent paper between them, so the
 * window's tint shows through the screen.
 */
export function Footer01() {
  return (
    <footer className="relative isolate w-full overflow-hidden bg-neutral-950 text-white">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt=""
        className="absolute inset-0 -z-20 size-full object-cover grayscale"
        src={image}
      />
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-neutral-950/55 via-neutral-950/65 to-neutral-950/90" />

      <div className="mx-auto max-w-6xl px-6 pt-10 pb-10 sm:px-10 sm:pt-14">
        <section
          aria-labelledby="footer-01-cta"
          className="relative overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/25"
        >
          <ColorDithering
            algorithm="bayer-4x4"
            brightness={0.02}
            chromaticSplit
            className="absolute inset-0"
            contrast={0.95}
            dotScale={0.75}
            image={image}
            levels={5}
            paperOpacity={0}
            pixelSize={2}
            saturation={1}
            spread={0.9}
          />
          <div className="relative flex min-h-80 flex-col items-center justify-center gap-6 px-6 py-16 text-center sm:min-h-96">
            <h2
              className="max-w-2xl text-balance text-4xl font-semibold tracking-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.35)] sm:text-5xl"
              id="footer-01-cta"
            >
              Take control of your interface.
            </h2>
            <a
              className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 shadow-lg shadow-black/20 transition-colors hover:bg-neutral-100"
              href="#"
            >
              Get started
            </a>
          </div>
        </section>

        <div className="mt-14 grid gap-12 md:grid-cols-[minmax(0,3fr)_minmax(0,4fr)] md:gap-8">
          <div>
            <p className="text-sm font-semibold tracking-wider uppercase">
              Vivid Layer
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              Components, blocks and shaders, meticulously crafted and ready to
              drop into your product.
            </p>
            <ul className="mt-8 flex gap-3">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    aria-label={social.label}
                    className="flex size-9 items-center justify-center rounded-lg bg-white/10 text-white/80 ring-1 ring-white/10 transition-colors hover:bg-white/20 hover:text-white"
                    href="#"
                  >
                    <svg
                      aria-hidden="true"
                      className="size-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={social.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3"
          >
            {columns.map((column) => (
              <div key={column.title}>
                <p className="text-xs font-medium tracking-wider text-white/60 uppercase">
                  {column.title}
                </p>
                <ul className="mt-4 flex flex-col gap-2.5 text-sm">
                  {column.links.map((link) => (
                    <li key={link}>
                      <a
                        className="text-white/85 transition-colors hover:text-white"
                        href="#"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className="mt-14 border-t border-white/10 pt-6 text-xs text-white/50">
          © 2026 Vivid Layer. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
