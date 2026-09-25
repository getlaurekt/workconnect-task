# Zadanie rekrutacyjne

Aplikacja została stworzona przy pomocy templatki `shadcn/ui monorepo template`

## Aplikacja dostępna pod linkami

## Instalacja

Wymagania:

- Node.js `>=20.9` (wymagane przez Next.js 16)
- npm (projekt używa `npm@11.6.1` z npm workspaces)

```bash
git clone https://github.com/getlaurekt/workconnect-task.git
cd workconnect-task
npm install
npm run dev
```

Aplikacja będzie dostępna pod [http://localhost:3000](http://localhost:3000).

Pozostałe skrypty uruchamiane z głównego katalogu:

| Skrypt                 | Opis                               |
| ---------------------- | ---------------------------------- |
| `npm run build`        | build produkcyjny                  |
| `npm run start -w web` | uruchomienie buildu produkcyjnego  |
| `npm run lint`         | ESLint                             |
| `npm run typecheck`    | sprawdzenie typów (`tsc --noEmit`) |
| `npm run format`       | formatowanie kodu Prettierem       |

## Opis

Domyślny theme aplikacji został zmieniony na `light`, aby aplikacja po otwarciu automatycznie odzwierciedliła design figmy.

> [!TIP]
> Theme można zmienić klikając klawisz <kbd>d</kbd>

### Widok produktów

**Pliki:**

- [`page.tsx`](apps/web/app/page.tsx) (jedyny page w aplikacji)
- [`product-catalog.tsx`](apps/web/components/products/product-catalog.tsx)

#### Layout

Główny element `main` ma ustawiony padding klasą `md:py-12.5` oraz `py-6` co daje wartości `50px` oraz `24px` co jest zgodne z designem figmy.

W tym widoku wykorzystuję container-queries [`page.tsx` (9-10 linijka)](apps/web/app/page.tsx#L9-L10), aby na podstawie szerokości głównego diva w [`page.tsx` (9-10 linijka)](apps/web/app/page.tsx#L9-L10) zmniejszać gap w widoku desktopowym i przy widoku mobilnym z kartami tak, aby breakpoint ekranu był odizolowany od breakpointu naszego elementu.

Wykorzystuje również klasę utility tailwinda `max-w-310` aby ograniczyć szerokość widoku produktu tak aby był zgodny z szerokością z figmy, która wynosi `1240px` co jest równe klasie `max-w-310` i używam `mx-auto` aby wycentrować ten div na środku ekranu, dzięki czemu szersze ekrany jak widescreeny mogą być dostosowane niezależnie od przestrzeni lub paddingów horyzontalnych.

#### Breakpoint tabelka → karty

Breakpoint container-queries jest ustawiony na `4xl` czyli `896px`, nie było to podane w figmie w makietach ani nie było dokładniejszych specyfikacji odnośnie takich rzeczy, więc uznałem na podstawie manualnego sprawdzenia w przeglądarce w którym momencie tabelka staje się zbyt "ciasna" dla kolumn, aby zmienić gap głównego diva i przełączyć za pomocą breakpointu container-queries widok z tabelki na karty [`product-catalog.tsx`](apps/web/components/products/product-catalog.tsx) ([54](apps/web/components/products/product-catalog.tsx#L54) oraz [64](apps/web/components/products/product-catalog.tsx#L64) linijka), aby zapobiec:

- overflowingu tabelki,
- możliwości scrollowania w przypadku braku `table-fixed` i `truncate` w [`product-table.tsx`](apps/web/components/products/product-table.tsx) ([16](apps/web/components/products/product-table.tsx#L16) oraz [31-37](apps/web/components/products/product-table.tsx#L31-L37) linijka), ponieważ komponent `Table` opakowuje tabelkę w div z `overflow-x-auto`,
- nachodzenia się na siebie komórek tabelki na mniejszych ekranach,
- niewidoczności pełnych nazw/tekstu w tabelce, co daje lepszy user experience.

#### Podział na komponenty

Header [`product-catalog.tsx` (36-51 linijka)](apps/web/components/products/product-catalog.tsx#L36-L51) potencjalnie mógłby być osobnym komponentem gdyby był potrzebny w innych miejscach, ale zostawiłem go jako, że jest używany w jednym miejscu, więc enkapsulacja tego elementu jako osobny komponent nie miałaby sensu.

Natomiast samo dodawanie produktu [`add-product-dialog.tsx` (`<AddProductDialog />` 32 linijka)](apps/web/components/products/form/add-product-dialog.tsx#L32) już miało sens, ponieważ na podstawie opisu zadania formularz ma działać bezpośrednio w dialogu.

### Pola formularza (Input, Checkbox, Switch)

**Pliki:**

- [`field.tsx`](packages/ui/src/components/field.tsx)
- [`input.tsx`](packages/ui/src/components/input.tsx)
- [`checkbox.tsx`](packages/ui/src/components/checkbox.tsx)
- [`switch.tsx`](packages/ui/src/components/switch.tsx)
- [`form-fields.tsx`](apps/web/components/form/form-fields.tsx)

Przy stylowaniu pól formularza pod figmę postawiłem na podejście kompozycyjne, czyli stany takie jak invalid, disabled, checked czy wersja Box checkboxa i switcha nie są osobnymi komponentami ani nowymi wariantami typu `variant="box"`, tylko odpalają się same na podstawie tego jak poskładamy komponenty. Komponenty sprawdzają przez selektory tailwinda `has-*` i `group-*` oraz atrybuty `data-slot`, `data-invalid` i `aria-invalid` w czym się znajdują i co mają w środku, więc jeśli stworzymy odpowiednią kompozycję to style będą działać. Dzięki temu nie musiałem tworzyć customowych komponentów, dodawać nowych wariantów ani modyfikować samego `Switch` czy `Checkbox`, a jako trigger dla styli wykorzystuję kompozycje, które są podane w dokumentacji shadcn.

#### Input

Dla inputów wykorzystuję kompozycję z [dokumentacji shadcn dla TanStack Form](https://ui.shadcn.com/docs/forms/tanstack-form), gdzie `data-invalid` na `Field` koloruje label na czerwono [`field.tsx` (55 linijka)](packages/ui/src/components/field.tsx#L55), a `aria-invalid` na `Input` dodaje czerwony ring i obramowanie [`input.tsx` (7 linijka)](packages/ui/src/components/input.tsx#L7):

```tsx
<Field data-invalid={invalid}>
  <FieldLabel htmlFor={id}>Nazwa</FieldLabel>
  <Input id={id} aria-invalid={invalid} />
  {invalid && <FieldError errors={errors} />}
</Field>
```

Ta kompozycja siedzi w komponencie `FormField` [`form-fields.tsx` (54-58 linijka)](apps/web/components/form/form-fields.tsx#L54-L58) i korzystają z niej `TextField`, `TextareaField`, `NumberField` oraz `SelectField`, więc każde nowe pole dostaje od razu te same stany bez dodatkowego stylowania.

#### Checkbox i Switch

W wersji Default checkbox albo switch leży obok labela w `Field` z `orientation="horizontal"`, tak jak w `SwitchField` [`form-fields.tsx` (233-242 linijka)](apps/web/components/form/form-fields.tsx#L233-L242) i `CheckboxField` [`form-fields.tsx` (251-260 linijka)](apps/web/components/form/form-fields.tsx#L251-L260):

```tsx
<Field orientation="horizontal">
  <Checkbox id={id} />
  <FieldLabel htmlFor={id}>Produkt limitowany</FieldLabel>
</Field>
```

Wersja Box to po prostu kompozycja [Choice Card](https://ui.shadcn.com/docs/components/base/field#choice-card) z dokumentacji shadcn, czyli ten sam `Field` tylko opakowany w `FieldLabel`:

```tsx
<FieldLabel htmlFor={id}>
  <Field orientation="horizontal">
    <Checkbox id={id} />
    <FieldContent>
      <FieldTitle>Produkt limitowany</FieldTitle>
      <FieldDescription>Opis</FieldDescription>
    </FieldContent>
  </Field>
</FieldLabel>
```

`FieldLabel` sprawdza przez `has-[>[data-slot=field]]` czy ma w środku `Field` i dopiero wtedy zamienia się w box z ramką, zaokrągleniem i paddingiem [`field.tsx` (109-115 linijka)](packages/ui/src/components/field.tsx#L109-L115), a przez `has-data-checked` zmienia tło i kolor ramki po zaznaczeniu, które przy `aria-invalid` robią się czerwone. Przy disabled cały box ze switchem dostaje `opacity-50`, dlatego sam `Switch` w boxie wyłącza swoje opacity [`switch.tsx` (18 linijka)](packages/ui/src/components/switch.tsx#L18), żeby nie był przyciemniony podwójnie.

W formularzu dodawania produktu używam wersji Default [`step-availability.tsx`](apps/web/components/products/form/steps/step-availability.tsx) ([39](apps/web/components/products/form/steps/step-availability.tsx#L39) oraz [47](apps/web/components/products/form/steps/step-availability.tsx#L47) linijka), ale przejście na wersję Box to tylko zmiana kompozycji w `SwitchField` albo `CheckboxField`, bez ruszania komponentów w `packages/ui`.

### Struktura aplikacji

Struktura aplikacji używa podejścia per typ jako, że aplikacja jest mała nie ma sensu rozdzielać jej na podejście per ficzer. Gdyby aplikacja miała mieć dodatkowe moduły jak moduł od zamówień lub inne wtedy podejście struktury aplikacji per ficzer domenowo miałby sens.

Obecna struktura `apps/web` per typ:

```
apps/web/
├── app/
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── form/
│   │   └── form-fields.tsx
│   ├── products/
│   │   ├── form/
│   │   │   ├── steps/
│   │   │   │   ├── step-availability.tsx
│   │   │   │   ├── step-basic-info.tsx
│   │   │   │   └── step-pricing.tsx
│   │   │   ├── add-product-dialog.tsx
│   │   │   ├── product-form-options.ts
│   │   │   ├── product-form-step-layout.tsx
│   │   │   └── product-form-stepper.tsx
│   │   ├── product-cards.tsx
│   │   ├── product-catalog.tsx
│   │   ├── product-pagination.tsx
│   │   ├── product-status-badge.tsx
│   │   └── product-table.tsx
│   └── theme-provider.tsx
├── hooks/
│   ├── form-context.ts
│   └── form.ts
└── lib/
    ├── products/
    │   ├── format.ts
    │   ├── mock-data.ts
    │   ├── pricing.ts
    │   └── schema.ts
    └── search-params.ts
```

Przykładowo po dodaniu modułu zamówień struktura per ficzer mogłaby wyglądać tak:

```
apps/web/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── orders/
│       └── page.tsx
├── features/
│   ├── products/
│   │   ├── components/
│   │   │   ├── form/
│   │   │   ├── product-catalog.tsx
│   │   │   ├── product-table.tsx
│   │   │   └── ...
│   │   └── lib/
│   │       ├── format.ts
│   │       ├── mock-data.ts
│   │       ├── pricing.ts
│   │       ├── schema.ts
│   │       └── search-params.ts
│   └── orders/
│       ├── components/
│       │   ├── order-table.tsx
│       │   └── ...
│       └── lib/
│           ├── schema.ts
│           └── ...
└── shared/
    ├── components/
    │   ├── form/
    │   │   └── form-fields.tsx
    │   └── theme-provider.tsx
    └── hooks/
        ├── form-context.ts
        └── form.ts
```

### Typowanie Aplikacji

W miejscach gdzie zod był wykorzystywany i mogłem wykorzystać wyciąganie typów na podstawie struktury obiektów zod dla reużywalności nie tworzyłem czystych typów typescript skoro zod oferuje mi pełne typesafety, to wykorzystałem jego mechanizm i praktycznie zastąpiłem typy typescript w miejscach gdzie zod mi na nie pozwalał dzięki czemu ograniczyłem duplikowanie kodu. Czyli zmiana obiektu/definicji/scheme z zoda = typy używane w innych miejscach inaczej wyglądają pod względem struktury, czy to też typów danych. Natomiast w miejscach gdzie tworzenie kodu używając zoda nie miało większego sensu używałem czystego typescript jak chociażby do propsów czy też innych rzeczy.

Wszystkie typy produktu wyciągam ze schem zoda w [`schema.ts` (150-152 linijka)](apps/web/lib/products/schema.ts#L150-L152), więc w projekcie nie ma ręcznie napisanego typu `Product`:

```ts
export type ProductFormValues = z.input<typeof productFormSchema>
export type Product = z.output<typeof productSchema>
export type Currency = Product["currency"]
```

`ProductFormValues` to typ wejściowy schemy, czyli wartości formularza zanim przejdą walidację, a `Product` to typ wyjściowy już po walidacji. Helper `required` [`schema.ts` (35-37 linijka)](apps/web/lib/products/schema.ts#L35-L37) dopuszcza na wejściu `null`, dzięki czemu puste selecty i pola z ceną mogą startować od `null` w [`product-form-options.ts` (5-27 linijka)](apps/web/components/products/form/product-form-options.ts#L5-L27):

```ts
const defaultValues: ProductFormValues = {
  basicInfo: {
    manufacturer: null,
    category: null,
    // ...
  },
  pricing: {
    priceNet: null,
    priceGross: null,
    // ...
  },
  // ...
}
```

a w `Product` te same pola mają już zawsze wartość, co widać w [`mock-data.ts` (3-21 linijka)](apps/web/lib/products/mock-data.ts#L3-L21):

```ts
export const mockProducts: Product[] = [
  {
    manufacturer: "Apple",
    category: "Komputery",
    priceNet: 8129.27,
    priceGross: 9999,
    // ...
  },
]
```

Oba obiekty są sprawdzane względem tej samej schemy, więc jeśli dodam nowe wymagane pole do `basicInfoShape` [`schema.ts` (52-64 linijka)](apps/web/lib/products/schema.ts#L52-L64), typescript od razu pokaże błąd w `defaultValues` i w `mockProducts`, dopóki go tam nie uzupełnię.

Tak samo listy producentów, kategorii, cech, stawek VAT i walut są tablicami `as const` [`schema.ts` (3-33 linijka)](apps/web/lib/products/schema.ts#L3-L33), z których korzysta zarówno zod, jak i selecty w formularzu [`step-basic-info.tsx` (15-20 linijka)](apps/web/components/products/form/steps/step-basic-info.tsx#L15-L20), więc dodanie nowego producenta w jednym miejscu zmienia i typ, i opcje w selecie:

```ts
export const MANUFACTURERS = [
  "Apple",
  "Samsung",
  "Sony",
  "Bosch",
  "Xiaomi",
  "Dyson",
  "Logitech",
] as const

manufacturer: required(z.enum(MANUFACTURERS, "Wybierz producenta")),

const manufacturerItems = MANUFACTURERS.map((value) => ({
  value,
  label: value,
}))
```

Czystego typescripta używam przy propsach i typach, które nie są danymi produktu, jak `ProductPaginationProps` [`product-pagination.tsx` (17-21 linijka)](apps/web/components/products/product-pagination.tsx#L17-L21) czy numer kroku formularza `ProductFormStep` [`product-form-stepper.tsx` (12 linijka)](apps/web/components/products/form/product-form-stepper.tsx#L12):

```ts
type ProductPaginationProps = {
  page: number
  pageCount: number
  className?: string
}

export type ProductFormStep = 1 | 2 | 3
```

a tam gdzie props przyjmuje dane produktu, jak w `ProductTable` [`product-table.tsx` (14 linijka)](apps/web/components/products/product-table.tsx#L14), używam typu `Product` wyciągniętego z zoda.

### Niepewności

#### Przycisk

W miejscach jak przycisk od dodawania produktu lub w dialogu, aby przejść dalej nie byłem pewien ze względu na brak informacji w opisie lub designie figmy jak zaimplementować przycisk zgodny z designem figmy, czy jako nowy wariant lub totalnie nowy komponent na podstawie buttona z shadcn, więc zmodyfikowałem wariant `default` w buttonie oraz jego size `lg` [`button.tsx`](packages/ui/src/components/button.tsx) ([10](packages/ui/src/components/button.tsx#L10) oraz [26](packages/ui/src/components/button.tsx#L26) linijka), aby był spójny z figmą, ale nie edytowałem jego stanów interakcji jak `hover` jako, że w figmie ten przycisk nie posiadał takich opcji jako, że nie był komponentem w figmie.

#### Waluty

Również w designie figmy widać waluty, ale nie ma opisu ich konkretnej funkcjonalności czy to w obliczaniu cen czy gdzieś indziej, więc potraktowałem to jako opcję bez większego znaczenia i nie pełni ona większej funkcjonalności poza tym, że musi przejść walidacje, którą zawsze przechodzi ponieważ zawsze jest domyślna wartość [`product-form-options.ts` (18 linijka)](apps/web/components/products/form/product-form-options.ts#L18).

Gdybym miał dodać funkcjonalność/wpływ waluty to ustawiłbym dla każdej przelicznik od złotówek i innych walut i dodał do formuły od wyliczania kwoty [`pricing.ts` (5-11 linijka)](apps/web/lib/products/pricing.ts#L5-L11), która widnieje pod opisem pdf:

> Wzór: brutto = netto × (1 + VAT / 100). Edycja jednego pola natychmiast przelicza pozostałe.

tak aby od razu kwota ze złotówek zmieniona na euro lub inną walutę dawała przeliczoną kwotę.

#### Badge

W designie figmy badge miały różne style ustawione, aczkolwiek tylko niedostępny i dostępny widnieją w designie, więc pomimo customizacji wyglądu każdego wariantu oraz stanu wariantu przez dodanie go nie zastosowałem innych wariantów, dlatego powstał komponent [`product-status-badge.tsx`](apps/web/components/products/product-status-badge.tsx).

---

Pozdrawiam 😊
