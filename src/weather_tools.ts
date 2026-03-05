export const owmKeyMapping: { [weatherCode: number ]: string } = {
  0: "clear",
  1: "mainly_clear",
  2: "cloudy",
  3: "overcast",

  45: "fog",
  48: "depositing_rime_fog",

  51: "drizzle_light",
  53: "drizzle",
  55: "drizzle_dense",

  56: "freezing_drizzle_light",
  57: "freezing_drizzle_dense",

  61: "rain_slight",
  63: "rain",
  65: "rain_dense",

  66: "freezing_rain_light",
  67: "freezing_rain_heavy",

  71: "snow_slight",
  73: "snow",
  75: "snow_heavy",

  77: "snow_grains",

  80: "rain_showers_slight",
  81: "rain_showers",
  82: "rain_showers_violent",

  85: "snow_showers_slight",
  86: "snow_showers_heavy",

  95: "thunderstorm",
  96: "thunderstorm_hail",
  99: "thunderstorm_hail",
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

export const uvIndexRiskMapping: [number, string][] = [
  [ 0, 'no-risk' ],
  [ 1, 'low' ],
  [ 3, 'moderate' ],
  [ 6, 'high' ],
  [ 8, 'very-high' ],
  [ 11, 'extreme' ],
]

export const moonPhases = [
  'new_moon',
  'waxing_crescent',
  'first_quarter',
  'waxing_gibbous',
  'full_moon',
  'waning_gibbous',
  'third_quarter',
  'waning_crescent',
]

import { MoonPhase } from "astronomy-engine"

export function getMoonPhase(date: Date)
{
  return moonPhases[Math.round(MoonPhase(date)/45)%8]!
}

type Converter = (value: number) => number
type ConversionMap = {
  [key: string]: Converter
}

export const speedConverionMap: ConversionMap = {
  ms: v => v / 3.6,
  mph: v => v * 0.6213712,
  kn: v => v * 0.5399568,
  bft: v => Math.pow(v / 3.0096, 2/3),
}

export const distanceConversionMap: ConversionMap = {
  inch: v => v / 25.4,
}

export const temperatureConversionMap: ConversionMap = {
  fahrenheit: v => v * 1.8 + 32,
  kelvin: v => v + 273.15,
}

export function angleToCompassIndex(angle: number, compassDirections = 16)
{
  return Math.round(
      ((angle %= 360) < 0 ? angle + 360 : angle) / (360 / compassDirections))
    % compassDirections
}