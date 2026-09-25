import { createSerializer, parseAsInteger } from "nuqs"

export const productListParams = {
  page: parseAsInteger.withDefault(1),
}

export const serializeProductListParams = createSerializer(productListParams)
