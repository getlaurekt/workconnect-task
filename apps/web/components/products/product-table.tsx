import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table"

import { ProductStatusBadge } from "@/components/products/product-status-badge"
import { formatPrice, formatStock } from "@/lib/products/format"
import type { Product } from "@/lib/products/schema"

export function ProductTable({ products }: { products: Product[] }) {
  return (
    <Table className="table-fixed">
      <TableHeader>
        <TableRow className="bg-muted/50 hover:bg-muted/50">
          <TableHead className="w-1/4">Nazwa</TableHead>
          <TableHead>SKU</TableHead>
          <TableHead>Kategoria</TableHead>
          <TableHead>Cena Brutto</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Magazyn</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id} className="h-12">
            <TableCell className="px-4 font-medium">
              <span className="block truncate">{product.name}</span>
            </TableCell>
            <TableCell className="px-4 text-xs text-muted-foreground">
              <span className="block truncate">{product.sku}</span>
            </TableCell>
            <TableCell className="px-4 text-muted-foreground">
              <span className="block truncate">{product.category}</span>
            </TableCell>
            <TableCell className="px-4 font-medium">
              {formatPrice(product.priceGross, product.currency)}
            </TableCell>
            <TableCell className="px-4">
              <ProductStatusBadge available={product.available} />
            </TableCell>
            <TableCell className="px-4">{formatStock(product)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
