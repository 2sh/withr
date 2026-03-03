import type {
  LongShortNarrowName,
  PrecipitationSymbols,
  TempSymbols,
  WindSpeedSymbols
} from "../../types"

const weekdays: LongShortNarrowName[] = [
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

const today: LongShortNarrowName = {
  long: "Himma daga",
  short: "Him",
  narrow: "H",
}

const months: LongShortNarrowName[] = [
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

const conditionDescription: { [conditionKey: string]: string | {[condition: string]: string} } = {
  "clear": {
    day: "Bairht",
    night: "Himins skeirs",
  },
  "mainly_clear": {
    day: "Bairht mikilaba",
    night: "Skeir mikilaba",
  }, // du dailai maistai? or something with filaus?
  "cloudy": "Milhmag", // just making it "cloudy" but could add suman for the partly bit
  "overcast": "Ufarskadwiþ",

  "fog": "Nibls",
  "depositing_rime_fog": "Nibls friusands",

  "drizzle_light": "Ufartrusnjando leitil",
  "drizzle": "Ufartrusnjando",
  "drizzle_dense": "Ufartrusnjando filu",

  "freezing_drizzle_light": "Ufartrusnjando friusando leitil",
  "freezing_drizzle_dense": "Ufartrusnjando friusando filu ",

  "rain_slight": "Rign leitil",
  "rain": "Rign",
  "rain_dense": "Rignis filu",

  "freezing_rain_light": "Rign friusando leitil",
  "freezing_rain_heavy": "Rignis friusandins filu",

  "snow_slight": "Snaiws leitils",
  "snow": "Snaiws",
  "snow_heavy": "Snaiwis filu",

  "snow_grains": "Snaiwis kaurnona",

  "rain_showers_slight": "Rignis skūros leitilos",
  "rain_showers": "Rignis skūros",
  "rain_showers_violent": "Rignis skūro filu",

  "snow_showers_slight": "Snaiwis skūros leitilos",
  "snow_showers_heavy": "Snaiwis skūro filu",

  "thunderstorm": "Þeihwo",
  "thunderstorm_hail": "Þeihwo miþ hagla",
}

const compassDirections =
  ["N", "NNA", "NA", "ANA",
   "A", "ASA", "SA", "SSA", // austra
   "S", "SSW", "SW", "WSW",
   "W", "WNW", "NW", "NNW"]

const tempSymbols: TempSymbols = {
  celsius: 'C',
  fahrenheit: 'F',
  kelvin: 'K',
}

const windSpeedSymbols: WindSpeedSymbols = {
  kmh: " km/h",
  ms: " m/s",
  mph: " mph",
  kn: " Knots",
  bft: ' B',
}

const precipitationSymbols: PrecipitationSymbols = {
  mm: " mm",
  inch: " in",
}

export default {
  today,
  weekdays,
  months,
  conditionDescription,
  compassDirections,
  tempSymbols,
  windSpeedSymbols,
  precipitationSymbols,

  ui:
  {
    weather_in_gothic: 'Wiþr in Gutrazdai',
    now_in: "Nū in",
    now: "Nū",
    humidity: 'Qrammiþa Luftaus',
    precipitation: 'Mitadjo Rignis',
    uv_index: 'Wairþ UV',
    apparent_temp: 'Ufkunnaiþ',
    am: 'a.m.',
    pm: 'p.m.',
  }
}