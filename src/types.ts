import type { RemovableRef } from "@vueuse/core"

type ArrayObject<Type> = {
  [Property in keyof Type]: Type[Property][]
}

export type WeatherDataHour = {
  time: string,

  is_day: boolean,
  weather_code: number,

  temperature_2m: number,
  apparent_temperature: number,
  uv_index: number,

  precipitation_probability: number,
  precipitation: number,
  relative_humidity_2m: number,

  wind_speed_10m: number,
  wind_direction_10m: number,
}

export type WeatherDataHourly = ArrayObject<WeatherDataHour>

export type WeatherDataDay = {
  time: string,
  temperature_2m_max: number,
  temperature_2m_min: number,
  weather_code: number,
}

export type WeatherDataDaily = ArrayObject<WeatherDataDay>

export type WeatherData = {
  hourly: WeatherDataHourly,
  daily: WeatherDataDaily,
  current: WeatherDataHour,
  utc_offset_seconds: number,
}


export type longShortNarrowName = {
  long: string,
  short: string,
  narrow: string,
}

export type WithrDay = {
  title: longShortNarrowName,
  tempMax: string,
  tempMin: string,
  imageUrl: string,
}

export type WithHourSimple = {
  formattedDate: string,

  isFoldedSectionVisible: boolean,

  description: string,
  imageUrl: string,

  temp: string,
  apparentTemp: string,
  uvIndex: string,
  uvIndexRisk: string,

  precipitationProbability: string,
  precipitation: string,
  humidity: string,

  windSpeed: string,
  windCompassDirection: string,
  windDirection: number,
}

export type WithrHour = {
  title: string,
} & WithHourSimple

export type GothicNumeralMode =
  'none'
  | 'mix'
  | 'full'

export interface TempSymbols {
  celsius: string,
  fahrenheit: string,
}
export type TempUnit = keyof TempSymbols

export interface WindSpeedSymbols {
  kmh: string,
  ms: string,
  mph: string,
  kn: string,
}
export type WindSpeedUnit = keyof WindSpeedSymbols

export interface PrecipitationSymbols {
  mm: string,
  inch: string,
}
export type PrecipitationUnit = keyof PrecipitationSymbols

export type WithrOptions = {
  isGothicScript: boolean,
  gothicNumeralMode: GothicNumeralMode,
  is24hour: boolean,

  tempUnit: TempUnit,
  windSpeedUnit: WindSpeedUnit,
  precipitationUnit: PrecipitationUnit,
}

export type SearchResult = {
  title: string,
  name?: string,
  lat: number,
  long: number,
}