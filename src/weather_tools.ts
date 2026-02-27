const owmMapping: { [weatherCode: number] : number} =
{
  0: 1,
  1: 1,
  2: 2,
  3: 3,

  45: 50,
  48: 50,

  51: 9,
  53: 9,
  55: 9,
  56: 9,
  57: 9,

  61: 10,
  63: 10,
  65: 10,
  66: 10,
  67: 10,

  71: 13,
  73: 13,
  75: 13,
  77: 13,

  80: 9,
  81: 9,
  82: 9,

  85: 13,
  86: 13,

  95: 11,
  96: 11,
  99: 11,
}

export function getOwmImageUrl(weatherCode: number, isDay: boolean)
{
  const imageCode = (owmMapping[weatherCode] || 1).toString().padStart(2, '0')
  const dayNightCode = isDay ? 'd' : 'n'
  return `http://openweathermap.org/img/wn/${imageCode}${dayNightCode}@2x.png`
}

const timezonesWithFahrenheit = [
  "America/Adak",
  "America/Anchorage",
  "America/Atka",
  "America/Boise",
  "America/Chicago",
  "America/Denver",
  "America/Detroit",
  "America/Fort_Wayne",
  "America/Indiana/Indianapolis",
  "America/Indiana/Knox",
  "America/Indiana/Marengo",
  "America/Indiana/Petersburg",
  "America/Indiana/Tell_City",
  "America/Indiana/Vevay",
  "America/Indiana/Vincennes",
  "America/Indiana/Winamac",
  "America/Indianapolis",
  "America/Juneau",
  "America/Kentucky/Louisville",
  "America/Kentucky/Monticello",
  "America/Knox_IN",
  "America/Los_Angeles",
  "America/Louisville",
  "America/Menominee",
  "America/Metlakatla",
  "America/New_York",
  "America/Nome",
  "America/North_Dakota/Beulah",
  "America/North_Dakota/Center",
  "America/North_Dakota/New_Salem",
  "America/Phoenix",
  "America/Shiprock",
  "America/Sitka",
  "America/Yakutat",
  "Navajo",
  "Pacific/Honolulu",
  "US/Alaska",
  "US/Aleutian",
  "US/Arizona",
  "US/Central",
  "US/East-Indiana",
  "US/Eastern",
  "US/Hawaii",
  "US/Indiana-Starke",
  "US/Michigan",
  "US/Mountain",
  "US/Pacific",
]

const timezonesWithImperial = [
  "Europe/Jersey",
  "Europe/Isle_of_Man",
  "Europe/Guernsey",
  "Europe/Belfast",
  "Europe/London",
  "GB",
  "GB-Eire",
]

export type DeterminedUnits = {
  isFahrenheit: boolean
  isImperial: boolean
}

export function determineUnits(skip = false): DeterminedUnits
{
  if (!skip)
  {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (timezonesWithFahrenheit.includes(tz))
      return { isFahrenheit: true, isImperial: true }
    if (timezonesWithImperial.includes(tz))
      return { isFahrenheit: false, isImperial: true }
  }
  return { isFahrenheit: false, isImperial: false}
}
