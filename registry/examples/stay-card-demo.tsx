import {
  StayCard,
  type StayCardImage,
} from "@/components/ui/stay-card"

const stayCardDemoImages = [
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
] as const satisfies readonly StayCardImage[]

export default function StayCardDemo() {
  return (
    <div
      id="stay-card-demo"
      className="flex min-h-[36rem] w-full items-center justify-center p-6 sm:p-10"
    >
      <StayCard
        className="w-80 max-w-full"
        images={stayCardDemoImages}
        href="#stay-card-demo"
        title="Harbour Light House"
        location="The Rocks, Sydney"
        beds={2}
        squareFeet={560}
        price="$286"
        rating={4.92}
        reviewCount={184}
      />
    </div>
  )
}

export { stayCardDemoImages }
