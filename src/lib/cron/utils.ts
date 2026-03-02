export function frequencyLabel(expr: string): string {
  const patterns: [RegExp, string | ((m: RegExpMatchArray) => string)][] = [
    [/^(\d+) \* \* \* \*$/, 'Toutes les heures'],
    [/^\* \* \* \* \*$/, 'Chaque minute'],
    [/^0 (\d+) \* \* \*$/, (m) => `Tous les jours à ${m[1]}h`],
    [/^0 (\d+) \* \* 1-5$/, (m) => `Lun-Ven à ${m[1]}h`],
    [/^0 (\d+) \* \* 0$/, (m) => `Dimanche à ${m[1]}h`],
    [/^0 0 \* \* \*$/, 'Tous les jours à minuit'],
    [/^0 (\d+),(\d+) \* \* \*$/, (m) => `Tous les jours à ${m[1]}h et ${m[2]}h`],
    [/^0 0 1 \* \*$/, 'Tous les 1er du mois'],
  ]

  for (const [regex, labelOrFn] of patterns) {
    const match = expr.match(regex)
    if (match) {
      return typeof labelOrFn === 'function' ? labelOrFn(match) : labelOrFn
    }
  }
  return expr
}
