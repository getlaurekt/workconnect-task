import { ProductStatusBadge } from "@/components/products/product-status-badge"
import { formatPrice, formatStock } from "@/lib/products/format"
import type { Product } from "@/lib/products/schema"

export function ProductCards({ products }: { products: Product[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {products.map((product) => (
        <li
          key={product.id}
          className="flex flex-col gap-2 rounded-xl border bg-card p-3 text-card-foreground"
        >
          <div className="flex items-center gap-2.5">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <p className="truncate text-base font-medium">{product.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {product.sku}
              </p>
            </div>
            <ProductStatusBadge available={product.available} />
          </div>
          <dl className="grid grid-cols-3 gap-1 rounded-[9px] bg-accent p-3">
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs text-muted-foreground">Kategoria</dt>
              <dd className="truncate text-sm">{product.category}</dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs text-muted-foreground">Cena brutto</dt>
              <dd className="truncate text-sm font-medium">
                {formatPrice(product.priceGross, product.currency)}
              </dd>
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <dt className="text-xs text-muted-foreground">Magazyn</dt>
              <dd className="truncate text-sm">{formatStock(product)}</dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  )
}
