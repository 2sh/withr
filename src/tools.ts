export function setBodyClass(value: string | null, prefix: string)
{
  document.body.classList.forEach(c => {
    if (c.startsWith(prefix))
      document.body.classList.remove(c)
  })
  if (value)
    document.body.classList.add(
      `${prefix}${value.replaceAll("_", '-')}`)
}