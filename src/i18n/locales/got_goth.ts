import type {
  PrecipitationSymbols,
  TempSymbols,
  WindSpeedSymbols
} from "@/types"

const tempSymbols: TempSymbols = {
  celsius: 'C',
  fahrenheit: 'F',
}

const windSpeedSymbols: WindSpeedSymbols = {
  kmh: " km/h",
  ms: " m/s",
  mph: " mph",
  kn: " Knots",
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
    uvIndex: '𐍅𐌰𐌹𐍂𐌸 UV',
    am: '𐌰𐌼',
    pm: '𐍀𐌼',
  }
}