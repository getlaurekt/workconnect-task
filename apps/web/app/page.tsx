import { connection } from "next/server"

import { ProductCatalog } from "@/components/products/product-catalog"

export default async function Page() {
  await connection()

  return (
    <main className="@container/list min-h-svh bg-neutral-50 px-4 py-6 md:px-8 md:py-12.5 dark:bg-background">
      <div className="mx-auto flex w-full max-w-310 flex-col gap-4 @4xl/list:gap-6">
        <ProductCatalog />
      </div>
    </main>
  )
}
