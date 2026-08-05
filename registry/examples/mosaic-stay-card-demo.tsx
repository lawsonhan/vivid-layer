import {
  MosaicStayCard,
  type MosaicStayCardImage,
} from "@/components/ui/mosaic-stay-card"

const mosaicStayCardDemoImages = [
  {
    src: "https://images.pexels.com/photos/37433411/pexels-photo-37433411.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Spacious modern hotel room with a city view",
  },
  {
    src: "https://images.pexels.com/photos/35681350/pexels-photo-35681350.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Quiet resort courtyard with a swimming pool",
  },
  {
    src: "https://images.pexels.com/photos/33966955/pexels-photo-33966955.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Stone boutique hotel entrance framed by flowers",
  },
] as const satisfies readonly MosaicStayCardImage[]

export default function MosaicStayCardDemo() {
  return (
    <div
      id="mosaic-stay-card-demo"
      className="flex min-h-[36rem] w-full items-center justify-center p-6 sm:p-10"
    >
      <MosaicStayCard
        className="w-80 max-w-full"
        images={mosaicStayCardDemoImages}
        href="#mosaic-stay-card-demo"
        title="Harbour Light House"
        address="80 Cumberland Street, The Rocks"
        description="A quiet harbour-side stay with warm interiors, thoughtful details, and Circular Quay within walking distance."
        rating={4.92}
      />
    </div>
  )
}

export { mosaicStayCardDemoImages }
