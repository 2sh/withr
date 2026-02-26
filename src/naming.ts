import type { longShortNarrowName, PrecipitationSymbols, TempSymbols, WindSpeedSymbols } from "./types"

export const weekdays: longShortNarrowName[] = [
  {
    long: "Sunnons daga",
    short: "Sun",
    narrow: "S",
  },
  {
    long: "Menins daga",
    short: "Men",
    narrow: "M",
  },
  {
    long: "Teiwis daga",
    short: "Tei",
    narrow: "T",
  },
  {
    long: "Wodanis daga",
    short: "Wod",
    narrow: "W",
  },
  {
    long: "Þunaris daga",
    short: "Þun",
    narrow: "Þ",
  },
  {
    long: "Friddjos daga",
    short: "Fri",
    narrow: "F",
  },
  {
    long: "Sambato",
    short: "Sam",
    narrow: "S",
  },
]

export const today: longShortNarrowName = {
  long: "Himma daga",
  short: "Him",
  narrow: "H",
}

export const months: longShortNarrowName[] = [
  {
    long: "Jānuāreis",
    short: "Jān",
    narrow: "J",
  },
  {
    long: "Faibruāreis",
    short: "Fai",
    narrow: "F",
  },
  {
    long: "Mārtjus",
    short: "Mār",
    narrow: "M",
  },
  {
    long: "Apreils",
    short: "Apr",
    narrow: "A",
  },
  {
    long: "Majus",
    short: "Maj",
    narrow: "M",
  },
  {
    long: "Jūnjus",
    short: "Jūn",
    narrow: "J",
  },
  {
    long: "Jūljus",
    short: "Jūl",
    narrow: "J",
  },
  {
    long: "Awgustus",
    short: "Awg",
    narrow: "A",
  },
  {
    long: "Saiptaimbair",
    short: "Sai",
    narrow: "S",
  },
  {
    long: "Auktobair",
    short: "Auk",
    narrow: "A",
  },
  {
    long: "Naubaimbair",
    short: "Nau",
    narrow: "N",
  },
  {
    long: "Daikaimbair",
    short: "Dai",
    narrow: "D",
  },
]

export const weatherCodeDescription: { [weatherCode: number]: string | {[condition: string]: string} } = {
  0: {
    day: "Bairht",
    night: "Himins skeirs",
  }, // "clear sky"
  1: {
    day: "Bairht mikilaba",
    night: "Skeir mikilaba",
  }, // "mainly clear"  du dailai maistai? or something with filaus?
  2: "Milhmag", // "partly cloudy" ~ just making it "cloudy" but could add suman for the partly bit
  3: "Ufarskadwiþ", // "overcast"

  45: "Nibls", // "fog"
  48: "Nibls friusands", // "depositing rime fog"

  51: "Ufartrusnjando leitil", // "Drizzle: Light intensity"
  53: "Ufartrusnjando", // "Drizzle: moderate intensity"
  55: "Ufartrusnjando filu", // "Drizzle: dense intensity"

  56: "Ufartrusnjando friusando leitil", // "Freezing Drizzle: Light intensity"
  57: "Ufartrusnjando friusando filu ", // "Freezing Drizzle: dense intensity"

  61: "Rign leitil", // "Rain: Slight intensity"
  63: "Rign", // "Rain: moderate intensity"
  65: "Rignis filu", // "Rain: dense intensity"

  66: "Rign friusando leitil", // "Freezing Rain: Light intensity"
  67: "Rignis friusandins filu", // "Freezing Rain: heavy intensity"

  71: "Snaiws leitils", // "Snow fall: Slight intensity"
  73: "Snaiws", // "Snow fall: moderate intensity"
  75: "Snaiwis filu", // "Snow fall: heavy intensity"

  77: "Snaiwis kaurnona", // "Snow grains"

  80: "Rignis skūros leitilos", // "Rain showers: Slight intensity"
  81: "Rignis skūros", // "Rain showers: moderate intensity"
  82: "Rignis skūro filu", // "Rain showers: violent intensity"

  85: "Snaiwis skūros leitilos", // "Snow showers: Slight intensity"
  86: "Snaiwis skūro filu", // "Snow showers: heavy intensity"

  95: "Þeihwo", // "Thunderstorm: Slight or moderate"
  96: "Þeihwo miþ hagla", // "Thunderstorm with hail"
  99: "Þeihwo miþ hagla", // "Thunderstorm with hail"
}

export const compassDirections =
  ["N", "NNA", "NA", "ANA",
   "A", "ASA", "SA", "SSA", // austra
   "S", "SSW", "SW", "WSW",
   "W", "WNW", "NW", "NNW"]

export const tempSymbols: TempSymbols = {
  celsius: 'C',
  fahrenheit: 'F',
}

export const windSpeedSymbols: WindSpeedSymbols = {
  kmh: " km/h",
  ms: " m/s",
  mph: " mph",
  kn: " Knots",
}

export const precipitationSymbols: PrecipitationSymbols = {
  mm: " mm",
  inch: " in",
}