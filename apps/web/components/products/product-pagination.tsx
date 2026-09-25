"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination"
import { cn } from "@workspace/ui/lib/utils"

import { serializeProductListParams } from "@/lib/search-params"

type ProductPaginationProps = {
  page: number
  pageCount: number
  className?: string
}

export function ProductPagination({
  page,
  pageCount,
  className,
}: ProductPaginationProps) {
  const pathname = usePathname()
  const pages = Array.from({ length: pageCount }, (_, index) => index + 1)
  const isFirst = page <= 1
  const isLast = page >= pageCount
  const pageLink = (target: number) => (
    <Link href={serializeProductListParams(pathname, { page: target })} />
  )

  return (
    <Pagination className={cn("mx-0 w-auto", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            render={pageLink(Math.max(page - 1, 1))}
            text="Wstecz"
            aria-label="Poprzednia strona"
            aria-disabled={isFirst}
            tabIndex={isFirst ? -1 : undefined}
            className={cn(isFirst && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
        {pages.map((pageNumber) => (
          <PaginationItem key={pageNumber}>
            <PaginationLink
              render={pageLink(pageNumber)}
              isActive={pageNumber === page}
            >
              {pageNumber}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            render={pageLink(Math.min(page + 1, pageCount))}
            text="Dalej"
            aria-label="Następna strona"
            aria-disabled={isLast}
            tabIndex={isLast ? -1 : undefined}
            className={cn(isLast && "pointer-events-none opacity-50")}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
