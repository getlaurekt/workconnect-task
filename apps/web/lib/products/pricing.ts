function roundPrice(amount: number) {
  return Math.round((amount + Number.EPSILON) * 100) / 100
}

export function grossFromNet(net: number, vatRate: number) {
  return roundPrice(net * (1 + vatRate / 100))
}

export function netFromGross(gross: number, vatRate: number) {
  return roundPrice(gross / (1 + vatRate / 100))
}
