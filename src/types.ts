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
  wind_speed_10m_max: number,
  weather_code: number,
}

export type WeatherDataDaily = ArrayObject<WeatherDataDay>

export type WeatherData = {
  hourly: WeatherDataHourly,
  daily: WeatherDataDaily,
  current: WeatherDataHour,
  utc_offset_seconds: number,
  elevation: number,
}


export type LongShortNarrowName = {
  long: string,
  short: string,
  narrow: string,
}

export type WithrDay = {
  title: string,
  tempMax: string,
  tempMin: string,
  conditionKey: string,

  classes: string[],
}

export type WithHourSimple = {
  formattedDate: string,

  isFoldedSectionVisible: boolean,

  conditionKey: string,
  isDay: boolean,

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

  isMoonVisible: boolean,

  classes: string[],
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
  kelvin: string,
}
export type TempUnit = keyof TempSymbols

export interface SpeedSymbols {
  kmh: string,
  ms: string,
  mph: string,
  kn: string,
  bft: string,
}
export type SpeedUnit = keyof SpeedSymbols

export interface PrecipitationSymbols {
  mm: string,
  inch: string,
}
export type PrecipitationUnit = keyof PrecipitationSymbols

export type Theme = 'dark' | 'light' | 'kiwi'

export type WithrOptions = {
  isGothicScript: boolean,
  gothicNumeralMode: GothicNumeralMode,
  is24hour: boolean,
  theme: Theme,

  tempUnit: TempUnit,
  windSpeedUnit: SpeedUnit,
  precipitationUnit: PrecipitationUnit,
}

export type SearchResult = {
  title: string,
  name?: string,
  lat: number,
  long: number,
}