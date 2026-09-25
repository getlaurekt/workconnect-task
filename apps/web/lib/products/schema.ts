import * as z from "zod"

export const MANUFACTURERS = [
  "Apple",
  "Samsung",
  "Sony",
  "Bosch",
  "Xiaomi",
  "Dyson",
  "Logitech",
] as const

export const CATEGORIES = [
  "Komputery",
  "Telefony",
  "RTV",
  "AGD",
  "Akcesoria",
] as const

export const FEATURES = [
  "Bluetooth",
  "WiFI",
  "USB-C",
  "Wodoodporny",
  "Bezprzewodowy",
  "Ekologiczny",
  "Premium",
] as const

export const VAT_RATES = [0, 5, 8, 23] as const

export const CURRENCIES = ["PLN", "EUR", "USD"] as const

function required<Output, Input>(schema: z.ZodType<Output, Input>) {
  return z.custom<Input | null>().pipe(schema)
}

function integer(emptyMessage: string) {
  return z.int({
    error: (issue) =>
      issue.input === null ? emptyMessage : "Podaj liczbę całkowitą",
  })
}

function price(emptyMessage: string) {
  return required(
    z.number({ error: emptyMessage }).positive("Cena musi być większa od 0")
  )
}

const basicInfoShape = {
  name: z.string().trim().min(3, "Nazwa musi mieć co najmniej 3 znaki"),
  sku: z
    .string()
    .trim()
    .min(1, "Podaj SKU produktu")
    .max(24, "SKU może mieć maksymalnie 24 znaki")
    .regex(/^[a-z0-9]*$/i, "SKU może zawierać tylko litery i cyfry"),
  description: z.string().trim().optional(),
  manufacturer: required(z.enum(MANUFACTURERS, "Wybierz producenta")),
  category: required(z.enum(CATEGORIES, "Wybierz kategorię")),
  features: z.array(z.enum(FEATURES)).min(1, "Wybierz co najmniej jedną cechę"),
}

const pricingShape = {
  priceNet: price("Podaj cenę netto"),
  priceGross: price("Podaj cenę brutto"),
  vatRate: z.literal(VAT_RATES, "Wybierz stawkę VAT"),
  currency: z.enum(CURRENCIES, "Wybierz walutę"),
}

const availabilityShape = {
  available: z.boolean(),
  limited: z.boolean(),
  stock: z.number().nullable(),
  minCartQty: required(
    integer("Podaj minimalną ilość").min(1, "Ilość musi wynosić co najmniej 1")
  ),
  maxCartQty: required(
    integer("Podaj maksymalną ilość").min(1, "Ilość musi wynosić co najmniej 1")
  ),
}

const availabilityObject = z.object(availabilityShape)
type Availability = z.output<typeof availabilityObject>

function whenValid(schema: z.ZodType) {
  return {
    when: ({ value }: z.core.ParsePayload) => schema.safeParse(value).success,
  }
}

const stockSchema = required(
  integer("Podaj ilość na magazynie").nonnegative("Ilość nie może być ujemna")
)

const stockRule = z.superRefine<Availability>(
  ({ limited, stock }, ctx) => {
    if (!limited) return
    for (const issue of stockSchema.safeParse(stock).error?.issues ?? []) {
      ctx.addIssue({ code: "custom", message: issue.message, path: ["stock"] })
    }
  },
  whenValid(availabilityObject.pick({ limited: true, stock: true }))
)

const cartRangeRule = z.superRefine<Availability>(
  ({ minCartQty, maxCartQty }, ctx) => {
    if (minCartQty <= maxCartQty) return
    ctx.addIssue({
      code: "custom",
      message: "Minimalna ilość nie może być większa niż maksymalna",
      path: ["minCartQty"],
    })
    ctx.addIssue({
      code: "custom",
      message: "Maksymalna ilość nie może być mniejsza niż minimalna",
      path: ["maxCartQty"],
    })
  },
  whenValid(availabilityObject.pick({ minCartQty: true, maxCartQty: true }))
)

export const basicInfoSchema = z.object(basicInfoShape)
export const pricingSchema = z.object(pricingShape)
export const availabilitySchema = availabilityObject.check(
  stockRule,
  cartRangeRule
)

export const productFormSchema = z.object({
  basicInfo: basicInfoSchema,
  pricing: pricingSchema,
  availability: availabilitySchema,
})

export const productSchema = z
  .object({
    id: z.string(),
    ...basicInfoShape,
    ...pricingShape,
    ...availabilityShape,
  })
  .check(stockRule, cartRangeRule)
  .overwrite((product) =>
    product.limited ? product : { ...product, stock: null }
  )

export type ProductFormValues = z.input<typeof productFormSchema>
export type Product = z.output<typeof productSchema>
export type Currency = Product["currency"]
