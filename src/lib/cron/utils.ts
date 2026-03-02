function pad(n: string): string {
  return n.padStart(2, '0')
}

export function frequencyLabel(expr: string): string {
  const patterns: [RegExp, string | ((m: RegExpMatchArray) => string)][] = [
    [/^\* \* \* \* \*$/, 'Chaque minute'],
    [/^\*\/(\d+) \* \* \* \*$/, (m) => `/${m[1]}min`],
    [/^(\d+) \* \* \* \*$/, (m) => `Horaire à :${pad(m[1])}`],
    [/^0 0 \* \* \*$/, 'Quotidien à minuit'],
    [/^0 (\d+) \* \* \*$/, (m) => `Quotidien à ${m[1]}h`],
    [/^(\d+) (\d+) \* \* \*$/, (m) => `Quotidien à ${m[2]}h${pad(m[1])}`],
    [/^0 (\d+),(\d+) \* \* \*$/, (m) => `Quotidien à ${m[1]}h et ${m[2]}h`],
    [/^(\d+) (\d+),(\d+) \* \* \*$/, (m) => `Quotidien à ${m[2]}h${pad(m[1])} et ${m[3]}h${pad(m[1])}`],
    [/^0 (\d+) \* \* 1-5$/, (m) => `Lun-Ven à ${m[1]}h`],
    [/^(\d+) (\d+) \* \* 1-5$/, (m) => `Lun-Ven à ${m[2]}h${pad(m[1])}`],
    [/^0 (\d+) \* \* 0$/, (m) => `Dimanche à ${m[1]}h`],
    [/^0 0 1 \* \*$/, 'Mensuel le 1er'],
    [/^0 (\d+) 1 \* \*$/, (m) => `Mensuel le 1er à ${m[1]}h`],
    [/^(\d+) (\d+) 1 \* \*$/, (m) => `Mensuel le 1er à ${m[2]}h${pad(m[1])}`],
    [/^0 (\d+) (\d+) \* \*$/, (m) => `Mensuel le ${m[2]} à ${m[1]}h`],
    [/^(\d+) (\d+) (\d+) \* \*$/, (m) => `Mensuel le ${m[3]} à ${m[2]}h${pad(m[1])}`],
    [/^0 (\d+) ([\d,]+) \* \*$/, (m) => `${m[2].replace(/,/g, ' et ')} du mois à ${m[1]}h`],
    [/^(\d+) (\d+) ([\d,]+) \* \*$/, (m) => `${m[3].replace(/,/g, ' et ')} du mois à ${m[2]}h${pad(m[1])}`],
  ]

  for (const [regex, labelOrFn] of patterns) {
    const match = expr.match(regex)
    if (match) {
      return typeof labelOrFn === 'function' ? labelOrFn(match) : labelOrFn
    }
  }
  return expr
}
