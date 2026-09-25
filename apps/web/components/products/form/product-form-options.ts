import { formOptions } from "@tanstack/react-form-nextjs"

import type { ProductFormValues } from "@/lib/products/schema"

const defaultValues: ProductFormValues = {
  basicInfo: {
    name: "",
    sku: "",
    description: "",
    manufacturer: null,
    category: null,
    features: [],
  },
  pricing: {
    priceNet: null,
    priceGross: null,
    vatRate: 23,
    currency: "PLN",
  },
  availability: {
    available: true,
    limited: false,
    stock: null,
    minCartQty: 1,
    maxCartQty: 10,
  },
}

export const productFormOptions = formOptions({ defaultValues })
