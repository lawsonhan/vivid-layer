import { ProductCard01 } from "@/components/blocks/product-card-01/product-card-01"

/*
 * The Product Card 01 block: tiles touch across a 1px gap, so a single
 * layer draws one line per gutter like a table's rules, and the seam
 * between the spec cells still stops where the product tile spans it.
 */
export default function CropMarksBentoHairlineDemo() {
  return (
    <div className="flex w-full items-center justify-center p-12 sm:p-16">
      <ProductCard01 />
    </div>
  )
}
