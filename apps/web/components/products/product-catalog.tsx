"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useQueryStates } from "nuqs"

import { AddProductDialog } from "@/components/products/form/add-product-dialog"
import { ProductCards } from "@/components/products/product-cards"
import { ProductPagination } from "@/components/products/product-pagination"
import { ProductTable } from "@/components/products/product-table"
import { formatProductCount } from "@/lib/products/format"
import { mockProducts } from "@/lib/products/mock-data"
import {
  productListParams,
  serializeProductListParams,
} from "@/lib/search-params"

const PAGE_SIZE = 5

export function ProductCatalog() {
  const router = useRouter()
  const pathname = usePathname()
  const [products, setProducts] = useState(mockProducts)
  const [params] = useQueryStates(productListParams)
  const total = products.length
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(Math.max(params.page, 1), pageCount)
  const visibleProducts = products.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  )
  const caption = `Strona ${page} z ${pageCount} · ${formatProductCount(total)}`

  return (
    <>
      <header className="flex items-center justify-between gap-1">
        <div className="flex min-w-0 flex-col gap-1">
          <h1 className="text-xl leading-normal font-semibold">Produkty</h1>
          <p className="text-sm text-muted-foreground">
            {formatProductCount(total)} w katalogu
          </p>
        </div>
        <AddProductDialog
          onAdd={(product) => {
            setProducts((current) => [product, ...current])
            router.replace(serializeProductListParams(pathname, { page: 1 }), {
              scroll: false,
            })
          }}
        />
      </header>
      <section
        aria-label="Lista produktów"
        className="hidden overflow-hidden rounded-lg border bg-card text-card-foreground shadow-xs @4xl/list:block"
      >
        <ProductTable products={visibleProducts} />
        <div className="flex items-center justify-between gap-4 border-t bg-muted/50 p-4">
          <p className="text-xs text-muted-foreground">{caption}</p>
          <ProductPagination page={page} pageCount={pageCount} />
        </div>
      </section>
      <section
        aria-label="Lista produktów"
        className="flex flex-col gap-6 @4xl/list:hidden"
      >
        <ProductCards products={visibleProducts} />
        <div className="flex flex-col items-center gap-4">
          <p className="text-center text-xs text-muted-foreground">{caption}</p>
          <ProductPagination page={page} pageCount={pageCount} />
        </div>
      </section>
    </>
  )
}
