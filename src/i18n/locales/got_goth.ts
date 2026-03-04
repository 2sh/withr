import type {
  PrecipitationSymbols,
  TempSymbols,
  SpeedSymbols
} from "@/types"

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
  bft: " B",
}

const precipitationSymbols: PrecipitationSymbols = {
  mm: " mm",
  inch: " in",
}

export default {
  tempSymbols,
  windSpeedSymbols,
  precipitationSymbols,
  ui:
  {
    uv_index: '𐍅𐌰𐌹𐍂𐌸 UV',
    am: '𐌰𐌼',
    pm: '𐍀𐌼',
  }
}