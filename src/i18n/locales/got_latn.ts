import type {
  LongShortNarrowName,
  PrecipitationSymbols,
  TempSymbols,
  SpeedSymbols
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
  "overcast": "Ufarskadwiþ", // 'warþ milhma jah ufarskadwida ins' Luke 9:34

  "fog": "Nibls",
  "depositing_rime_fog": "Nibls friusands",

  "drizzle_light": "Rign hnasqu leitil",
  "drizzle": "Rign hnasqu",
  "drizzle_dense": "Rignis hnasqaus filu",

  "freezing_drizzle_light": "Rign hnasqu friusando leitil",
  "freezing_drizzle_dense": "Rignis hnasqaus friusandndins filu",

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

const windDescription: { [scale: string]: string } = {
  'calm': 'Wis',
  'light_air': 'Neƕa wisa',
  'light_breeze': 'Waiando leitil',
  'gentle_breeze': 'Waiando',
  'moderate_breeze': 'Waiando filu',
  'fresh_breeze': 'Winds frisks',
  'strong_breeze': 'Winds swinþs',
  'near_gale': 'Winds mahteigs',
  'gale': 'Winds skurags',
  'strong_gale': 'Skura',
  'storm': 'Skura swinþa',
  'violent_storm': 'Skura mahteiga',
  'hurricane': 'Skura abra',
}

const moonPhaseDescription: { [phase: string]: string } = {
  'new_moon': 'Niujis mena',
  // or Niujamena?
  'waxing_crescent': 'Gilþa wahsjandei',
  // or Gilþamena? sickle-moon, Sichelmond
  'first_quarter': 'Halbs mena wahsjands',
  // or Halbamena?
  'waxing_gibbous': 'Mena wahsjands',
  // or Þrifidurdo-dailamena "dreiviertelmond", awkward maybe
  'full_moon': "Fulls mena",
  // fullamena?
  'waning_gibbous': 'Mena wanands',
  'third_quarter': 'Halbs mena wanands',
  'waning_crescent': 'Gilþa wanandei',
} // *wanands from wanains

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

const windSpeedSymbols: SpeedSymbols = {
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
  windDescription,
  compassDirections,
  moonPhaseDescription,
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
    sun: 'Sunno',
    moon: 'Mena',
    moon_phase: 'Griþs Menins',
    am: 'a.m.',
    pm: 'p.m.',
  }
}