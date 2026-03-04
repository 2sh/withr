import { toGothicNumerals } from "./transliterate"

export function addOverlineHtml(content: string)
{
  return `<span class='overline'>${content}</span>`
}

function toGothicFractionalValue(value: number, denominator: null | number = null)
{
  if (!denominator) return ''
  const fractionalValue = Math.round((Math.abs(value) % 1) * denominator)
  if (!fractionalValue) return ''

  console.log(fractionalValue)
  const gothicNumerator = toGothicNumerals(fractionalValue)
  const gothicDenominator = toGothicNumerals(denominator)
  return `<sup>${gothicNumerator}</sup><span class='frac-div'>&frasl;</span><sub>${gothicDenominator}</sub>`
}

export function toGothicValue(value: number, denominator: null | number = null)
{
  const gothicFractionalValue = toGothicFractionalValue(value, denominator)

  const absValue = Math.abs(Math.round(value))
  const absGothicValue = absValue == 0
    ? (gothicFractionalValue ? gothicFractionalValue : "0")
    : toGothicNumerals(absValue) + ' ' + gothicFractionalValue

  const gothicValue = value < 0 ? `(${absGothicValue})` : absGothicValue
  const fValue = `·${addOverlineHtml(gothicValue)}·`
  return fValue
}
