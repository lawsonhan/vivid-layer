import { PrintHalftone } from "@/components/effects/print-halftone"

export default function PrintHalftoneDemo() {
  return (
    <div className="aspect-video min-h-80 w-full overflow-hidden sm:min-h-0">
      <PrintHalftone image="/shader-assets/monument-valley.9a0e22e4434a.jpg" />
    </div>
  )
}
