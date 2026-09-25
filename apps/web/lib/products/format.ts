import type { Currency, Product } from "@/lib/products/schema"

const priceFormatter = new Intl.NumberFormat("pl-PL", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false,
})

export function formatPrice(amount: number, currency: Currency) {
  return `${priceFormatter.format(amount)} ${currency}`
}

export function formatStock(product: Product) {
  return product.limited && product.stock !== null ? String(product.stock) : "—"
}

export function formatProductCount(count: number) {
  const mod10 = count % 10
  const mod100 = count % 100
  if (count === 1) return "1 produkt"
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} produkty`
  }
  return `${count} produktów`
}
