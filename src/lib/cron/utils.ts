function pad(n: string): string {
  return n.padStart(2, '0')
}

export function frequencyLabel(expr: string): string {
  const patterns: [RegExp, string | ((m: RegExpMatchArray) => string)][] = [
    // Chaque minute
    [/^\* \* \* \* \*$/, 'Chaque minute'],
    // Toutes les N minutes
    [/^\*\/(\d+) \* \* \* \*$/, (m) => `Toutes les ${m[1]} minutes`],
    // Toutes les heures à :MM
    [/^(\d+) \* \* \* \*$/, (m) => `Toutes les heures à :${pad(m[1])}`],
    // Tous les jours à minuit
    [/^0 0 \* \* \*$/, 'Tous les jours à minuit'],
    // Tous les jours à HH:00
    [/^0 (\d+) \* \* \*$/, (m) => `Tous les jours à ${m[1]}h`],
    // Tous les jours à HH:MM
    [/^(\d+) (\d+) \* \* \*$/, (m) => `Tous les jours à ${m[2]}h${pad(m[1])}`],
    // Deux fois par jour
    [/^0 (\d+),(\d+) \* \* \*$/, (m) => `Tous les jours à ${m[1]}h et ${m[2]}h`],
    [/^(\d+) (\d+),(\d+) \* \* \*$/, (m) => `Tous les jours à ${m[2]}h${pad(m[1])} et ${m[3]}h${pad(m[1])}`],
    // Lun-Ven
    [/^0 (\d+) \* \* 1-5$/, (m) => `Lun-Ven à ${m[1]}h`],
    [/^(\d+) (\d+) \* \* 1-5$/, (m) => `Lun-Ven à ${m[2]}h${pad(m[1])}`],
    // Dimanche
    [/^0 (\d+) \* \* 0$/, (m) => `Dimanche à ${m[1]}h`],
    // Jours spécifiques du mois
    [/^0 0 1 \* \*$/, 'Le 1er de chaque mois à minuit'],
    [/^0 (\d+) 1 \* \*$/, (m) => `Le 1er de chaque mois à ${m[1]}h`],
    [/^(\d+) (\d+) 1 \* \*$/, (m) => `Le 1er de chaque mois à ${m[2]}h${pad(m[1])}`],
    [/^0 (\d+) (\d+) \* \*$/, (m) => `Le ${m[2]} de chaque mois à ${m[1]}h`],
    [/^(\d+) (\d+) (\d+) \* \*$/, (m) => `Le ${m[3]} de chaque mois à ${m[2]}h${pad(m[1])}`],
    // Plusieurs jours du mois (ex: 1,15)
    [/^0 (\d+) ([\d,]+) \* \*$/, (m) => {
      const days = m[2].split(',').map(d => `${d}`).join(' et ')
      return `Les ${days} de chaque mois à ${m[1]}h`
    }],
    [/^(\d+) (\d+) ([\d,]+) \* \*$/, (m) => {
      const days = m[3].split(',').map(d => `${d}`).join(' et ')
      return `Les ${days} de chaque mois à ${m[2]}h${pad(m[1])}`
    }],
  ]

  for (const [regex, labelOrFn] of patterns) {
    const match = expr.match(regex)
    if (match) {
      return typeof labelOrFn === 'function' ? labelOrFn(match) : labelOrFn
    }
  }
  return expr
}
