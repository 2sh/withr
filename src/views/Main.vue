<script setup lang="ts">

import type {
  WithrOptions,
  TempSymbols,
  WeatherData,
  WeatherDataHour,
  WeatherDataHourly,
  WindSpeedSymbols,
  WithHourSimple,
  WithrDay,
  WithrHour,
  SearchResult,
  TempUnit,
  WindSpeedUnit,
  GothicNumeralMode,
  PrecipitationSymbols,
  PrecipitationUnit
} from '../types'

import {
  computed,
  ref,
  watch,
  watchEffect
} from 'vue'

import {
  compassDirections,
  months,
  precipitationSymbols,
  tempSymbols,
  today,
  weatherCodeDescription,
  weekdays,
  windSpeedSymbols,
} from '../naming'
import {
  determineUnits,
  getOwmImageUrl
} from '../weather_tools'
import {
  fromLatin,
  toGothicNumerals
} from '../transliterate'


import Options from '../components/Options.vue'
import Search from '../components/Search.vue'
import { toReactive, useLocalStorage } from '@vueuse/core'
import { useRoute } from 'vue-router'
import router from '@/router'

const showOptions = ref(false)

const determinedUnits = determineUnits()

const is24hour = useLocalStorage('is_24_hour', false)
const isGothicScript = useLocalStorage('is_gothic_script', true)
const gothicNumeralMode = useLocalStorage<GothicNumeralMode>('gothic_numeral_mode', 'full')

const tempUnit = useLocalStorage<TempUnit>('temp_unit', () =>
  determinedUnits.isFahrenheit ? 'fahrenheit' : 'celsius')
const windSpeedUnit = useLocalStorage<WindSpeedUnit>('wind_speed_unit',
  determinedUnits.isImperial ? 'mph' : 'kmh')
const precipitationUnit = useLocalStorage<PrecipitationUnit>('precipitation_unit',
  determinedUnits.isImperial ? 'inch' : 'mm')

const lat = ref<number | null>(null)
const long = ref<number | null>(null)
const placeName = ref<string | null>(null)

const data = ref<WeatherData | null>(null)
let dataTempUnit: TempUnit | null = null
let dataWindSpeedUnit: WindSpeedUnit | null = null
let dataPrecipitationUnit: PrecipitationUnit | null = null
//const utcOffsetSeconds = computed(() => data.value ? data.value.utc_offset_seconds : null)

const currentTime = computed(() => data.value ? new Date(data.value.current.time) : null)

const isLoading = ref(false)

/*
function getCurrentTimeFromOffset(offset: number)
{
  const date = new Date()
  date.setSeconds(date.getSeconds()+offset)
  return date
}
*/

let reloadData = false
watch(tempUnit, () => reloadData = true)
watch(windSpeedUnit, () => reloadData = true)
watch(precipitationUnit, () => reloadData = true)

async function getData()
{
  if (lat.value === null || long.value === null) return

  isLoading.value = true

  //const tz = Intl.DateTimeFormat().resolvedOptions().timeZone
  dataTempUnit = tempUnit.value
  dataWindSpeedUnit = windSpeedUnit.value
  dataPrecipitationUnit = precipitationUnit.value
  const hourParams = "is_day,weather_code,"
    + "temperature_2m,apparent_temperature,uv_index,"
    + "precipitation_probability,precipitation,relative_humidity_2m,"
    + "wind_speed_10m,wind_direction_10m"
  const url = "https://api.open-meteo.com/v1/forecast?"
    + "latitude=" + lat.value.toFixed(5) + "&longitude=" + long.value.toFixed(5)
    + "&daily=weather_code,temperature_2m_min,temperature_2m_max"
    + "&hourly=" + hourParams
    + "&current=" + hourParams
    + "&timezone=auto"
    + "&wind_speed_unit=" + dataWindSpeedUnit
    + "&temperature_unit=" + dataTempUnit
    + "&precipitation_unit=" + dataPrecipitationUnit

  //const raw_data = '{"latitude":52.34,"longitude":-2.06,"generationtime_ms":0.37860870361328125,"utc_offset_seconds":0,"timezone":"Europe/London","timezone_abbreviation":"GMT","elevation":90.0,"current_units":{"time":"iso8601","interval":"seconds","temperature_2m":"°F","weather_code":"wmo code","is_day":"","precipitation_probability":"%","wind_speed_10m":"km/h","wind_direction_10m":"°"},"current":{"time":"2026-02-23T13:30","interval":900,"temperature_2m":53.3,"weather_code":3,"is_day":1,"precipitation_probability":8,"wind_speed_10m":20.3,"wind_direction_10m":245},"hourly_units":{"time":"iso8601","temperature_2m":"°F","weather_code":"wmo code","is_day":"","precipitation_probability":"%","wind_speed_10m":"km/h","wind_direction_10m":"°"},"hourly":{"time":["2026-02-23T00:00","2026-02-23T01:00","2026-02-23T02:00","2026-02-23T03:00","2026-02-23T04:00","2026-02-23T05:00","2026-02-23T06:00","2026-02-23T07:00","2026-02-23T08:00","2026-02-23T09:00","2026-02-23T10:00","2026-02-23T11:00","2026-02-23T12:00","2026-02-23T13:00","2026-02-23T14:00","2026-02-23T15:00","2026-02-23T16:00","2026-02-23T17:00","2026-02-23T18:00","2026-02-23T19:00","2026-02-23T20:00","2026-02-23T21:00","2026-02-23T22:00","2026-02-23T23:00","2026-02-24T00:00","2026-02-24T01:00","2026-02-24T02:00","2026-02-24T03:00","2026-02-24T04:00","2026-02-24T05:00","2026-02-24T06:00","2026-02-24T07:00","2026-02-24T08:00","2026-02-24T09:00","2026-02-24T10:00","2026-02-24T11:00","2026-02-24T12:00","2026-02-24T13:00","2026-02-24T14:00","2026-02-24T15:00","2026-02-24T16:00","2026-02-24T17:00","2026-02-24T18:00","2026-02-24T19:00","2026-02-24T20:00","2026-02-24T21:00","2026-02-24T22:00","2026-02-24T23:00","2026-02-25T00:00","2026-02-25T01:00","2026-02-25T02:00","2026-02-25T03:00","2026-02-25T04:00","2026-02-25T05:00","2026-02-25T06:00","2026-02-25T07:00","2026-02-25T08:00","2026-02-25T09:00","2026-02-25T10:00","2026-02-25T11:00","2026-02-25T12:00","2026-02-25T13:00","2026-02-25T14:00","2026-02-25T15:00","2026-02-25T16:00","2026-02-25T17:00","2026-02-25T18:00","2026-02-25T19:00","2026-02-25T20:00","2026-02-25T21:00","2026-02-25T22:00","2026-02-25T23:00","2026-02-26T00:00","2026-02-26T01:00","2026-02-26T02:00","2026-02-26T03:00","2026-02-26T04:00","2026-02-26T05:00","2026-02-26T06:00","2026-02-26T07:00","2026-02-26T08:00","2026-02-26T09:00","2026-02-26T10:00","2026-02-26T11:00","2026-02-26T12:00","2026-02-26T13:00","2026-02-26T14:00","2026-02-26T15:00","2026-02-26T16:00","2026-02-26T17:00","2026-02-26T18:00","2026-02-26T19:00","2026-02-26T20:00","2026-02-26T21:00","2026-02-26T22:00","2026-02-26T23:00","2026-02-27T00:00","2026-02-27T01:00","2026-02-27T02:00","2026-02-27T03:00","2026-02-27T04:00","2026-02-27T05:00","2026-02-27T06:00","2026-02-27T07:00","2026-02-27T08:00","2026-02-27T09:00","2026-02-27T10:00","2026-02-27T11:00","2026-02-27T12:00","2026-02-27T13:00","2026-02-27T14:00","2026-02-27T15:00","2026-02-27T16:00","2026-02-27T17:00","2026-02-27T18:00","2026-02-27T19:00","2026-02-27T20:00","2026-02-27T21:00","2026-02-27T22:00","2026-02-27T23:00","2026-02-28T00:00","2026-02-28T01:00","2026-02-28T02:00","2026-02-28T03:00","2026-02-28T04:00","2026-02-28T05:00","2026-02-28T06:00","2026-02-28T07:00","2026-02-28T08:00","2026-02-28T09:00","2026-02-28T10:00","2026-02-28T11:00","2026-02-28T12:00","2026-02-28T13:00","2026-02-28T14:00","2026-02-28T15:00","2026-02-28T16:00","2026-02-28T17:00","2026-02-28T18:00","2026-02-28T19:00","2026-02-28T20:00","2026-02-28T21:00","2026-02-28T22:00","2026-02-28T23:00","2026-03-01T00:00","2026-03-01T01:00","2026-03-01T02:00","2026-03-01T03:00","2026-03-01T04:00","2026-03-01T05:00","2026-03-01T06:00","2026-03-01T07:00","2026-03-01T08:00","2026-03-01T09:00","2026-03-01T10:00","2026-03-01T11:00","2026-03-01T12:00","2026-03-01T13:00","2026-03-01T14:00","2026-03-01T15:00","2026-03-01T16:00","2026-03-01T17:00","2026-03-01T18:00","2026-03-01T19:00","2026-03-01T20:00","2026-03-01T21:00","2026-03-01T22:00","2026-03-01T23:00"],"temperature_2m":[46.3,46.3,46.3,46.5,46.4,46.1,46.4,46.0,45.8,47.8,49.2,50.8,53.3,53.6,52.8,52.3,51.1,50.1,50.0,50.9,51.5,52.3,52.4,52.0,51.6,51.2,51.0,50.9,49.9,48.8,48.0,47.2,47.4,48.7,49.9,50.8,51.2,52.5,53.3,53.9,53.6,52.4,50.4,48.7,47.5,46.9,46.6,46.7,46.7,46.4,46.1,46.3,46.5,46.4,46.5,46.5,47.0,48.3,50.1,52.5,54.9,56.2,57.2,57.2,57.2,56.2,54.9,54.1,52.9,51.8,51.1,50.7,50.3,49.9,49.3,48.6,48.0,47.7,47.5,48.0,48.3,49.2,50.1,51.2,52.0,52.4,52.4,52.2,51.9,51.3,50.7,50.0,49.3,49.0,49.3,50.2,50.6,50.5,50.2,49.6,48.6,47.4,46.5,46.0,45.9,46.3,47.6,49.4,50.9,51.6,51.8,51.5,50.4,48.8,47.3,45.9,44.6,43.4,42.2,41.2,40.5,40.4,40.8,41.0,40.9,40.8,40.8,39.3,40.9,42.7,44.5,46.5,48.0,48.4,48.2,47.9,47.2,46.4,45.8,45.5,45.5,45.4,45.0,44.6,44.0,43.1,42.0,41.2,40.8,40.6,40.7,40.9,41.4,42.2,43.6,45.3,46.6,47.4,48.0,48.0,47.2,45.9,44.8,44.2,43.8,43.7,44.0,44.6],"weather_code":[3,3,3,3,2,3,3,3,1,1,3,3,2,3,3,61,61,3,3,3,3,3,3,3,3,3,3,3,2,3,2,2,2,3,3,3,3,2,3,2,2,1,1,0,1,1,2,2,2,2,2,2,2,2,2,3,3,2,2,3,3,3,2,3,2,3,3,2,1,2,3,3,3,80,80,3,2,2,3,3,3,2,3,3,3,3,3,3,61,61,61,61,61,61,61,61,61,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,0,0,0,1,1,1,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,61,61,61,61,61,61,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,61,61,61,3,3],"is_day":[0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],"precipitation_probability":[0,0,0,0,0,0,0,0,0,0,0,0,0,5,10,25,33,28,15,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,2,3,4,4,5,6,8,10,12,14,15,16,16,15,13,10,8,8,10,10,5,5,5,5,6,7,8,10,13,17,23,30,37,43,48,52,56,60,63,65,65,64,61,57,52,48,43,38,32,26,20,15,13,13,16,20,25,27,28,25,21,15,9,3,0,0,0,0,2,3,4,4,4,5,6,7,8,10,12,15,18,22,25,29,32,35,37,39,40,40,40,39,37,36,34,32,30,28,26,25,25,25,26,26,27,28,30,31,32,34,35,37],"wind_speed_10m":[12.5,12.6,13.4,15.3,15.7,14.9,15.6,15.8,16.3,18.7,20.1,20.0,23.1,21.7,19.0,14.7,11.6,10.2,10.8,11.2,10.7,11.0,10.2,9.5,9.0,9.2,10.2,13.7,13.5,11.8,12.6,10.9,12.6,12.2,14.0,16.5,17.7,16.9,17.6,16.7,16.0,14.1,12.8,11.5,11.6,10.0,8.9,8.3,7.9,7.8,8.0,9.0,10.0,9.3,9.2,8.7,9.2,10.6,13.1,15.8,19.0,19.8,20.5,17.1,16.9,13.7,13.2,13.1,11.9,10.8,9.7,9.0,10.1,11.3,13.8,13.1,13.5,13.3,14.1,17.7,19.1,20.6,25.0,22.8,22.4,22.4,22.4,21.9,21.4,21.1,21.6,22.8,24.5,26.3,28.9,31.4,32.3,30.5,28.8,28.9,27.6,25.1,23.0,21.6,20.6,20.8,22.7,25.1,26.6,25.9,24.6,22.7,20.2,17.0,13.8,11.3,9.0,7.6,6.4,6.1,6.6,7.6,9.4,10.4,11.1,12.1,12.8,14.6,16.7,19.1,22.4,25.7,28.1,27.8,26.4,25.1,24.6,25.0,24.6,24.0,23.2,21.0,16.9,13.4,12.3,11.0,9.2,8.4,7.8,6.9,6.8,7.2,8.1,9.5,11.8,15.8,18.5,19.2,18.1,16.3,13.2,10.2,9.7,11.6,13.9,15.8,17.2,18.2],"wind_direction_10m":[213,211,216,227,233,233,236,240,245,245,246,247,255,249,241,239,216,190,201,213,222,232,222,209,209,206,198,207,209,211,200,186,183,178,181,190,197,191,191,186,188,176,169,166,158,165,166,162,156,146,153,157,154,164,169,173,169,170,185,188,198,205,211,208,207,203,197,189,183,184,184,182,186,189,187,189,196,199,195,197,200,205,210,211,206,208,210,210,205,197,191,185,182,182,185,190,197,209,227,239,241,238,235,237,241,244,247,249,251,256,263,268,269,266,261,253,241,225,207,183,171,175,180,182,171,160,155,160,161,164,169,174,177,176,175,173,173,174,175,172,168,168,178,200,220,221,211,200,202,208,212,207,201,205,220,235,241,242,239,235,225,203,178,164,159,156,154,153]},"daily_units":{"time":"iso8601","weather_code":"wmo code","temperature_2m_max":"°F","temperature_2m_min":"°F"},"daily":{"time":["2026-02-23","2026-02-24","2026-02-25","2026-02-26","2026-02-27","2026-02-28","2026-03-01"],"weather_code":[61,3,3,80,61,61,61],"temperature_2m_max":[53.6,53.9,57.2,52.4,51.8,48.4,48.0],"temperature_2m_min":[45.8,46.6,46.1,47.5,41.2,39.3,40.6]}}'
  //const parsed_data = JSON.parse(raw_data)
  //data.value = parsed_data

  const response = await fetch(url)
  data.value = await response.json()
  reloadData = false
  isLoading.value = false
}

function toGothicValue(value: number)
{
  const absValue = Math.abs(value)
  const absGothicValue = absValue == 0 ? 0 : toGothicNumerals(absValue)
  const gothicValue = value < 0 ? `(${absGothicValue})` : absGothicValue
  const fValue = `·<span class='overline'>${gothicValue}</span>·`
  return fValue
}

const actualGothicNumeralMode = computed(() =>
  !isGothicScript.value ? 'none' : gothicNumeralMode.value)

function formatTemp(value: number | undefined)
{
  if (typeof value === 'undefined') return '?'
  const rValue = Math.round(value)
  const fValue = actualGothicNumeralMode.value == 'full'
    ? toGothicValue(rValue) : rValue.toString()
  return fValue + '°' || ''
}

function formatPercentage(value: number | undefined)
{
  if (typeof value === 'undefined') return '?'
  const fValue = actualGothicNumeralMode.value == 'full'
    ? toGothicValue(value) : value.toString()
  return fValue + '%' || ''
}

function formatSpeed(value: number | undefined)
{
  if (typeof value === 'undefined') return '?'
  const rValue = Math.round(value)
  const fValue = actualGothicNumeralMode.value == 'full'
    ? toGothicValue(rValue) : rValue.toString()
  return fValue + windSpeedSymbols[dataWindSpeedUnit!] || ''
}

function formatCompassDirection(value: number | undefined)
{
  if (typeof value === 'undefined') return ''
  const index = Math.round(((value %= 360) < 0 ? value + 360 : value) / 22.5) % 16
  const direction = compassDirections[index] || ''
  const fValue = !isGothicScript.value ? direction : `<span class='overline'>${fromLatin(direction)}</span>`
  return fValue
}

function formatPrecipitation(value: number | undefined)
{
  if (typeof value === 'undefined') return '?'
  const rValue = Math.round(value)
  const fValue = actualGothicNumeralMode.value == 'full'
    ? toGothicValue(rValue) : rValue.toString()
  return fValue + precipitationSymbols[precipitationUnit.value] || ''
}

function formatHour(hour: Date)
{
  const hours = hour.getHours()
  if (is24hour.value)
  {
    return actualGothicNumeralMode.value == 'full'
      ? toGothicValue(hours)
      : hours.toString().padStart(2, '0')
  }

  const isPm = hours >= 12
  const h = (hours % 12) || 12
  const fh = actualGothicNumeralMode.value == 'none'
    ? h : toGothicValue(h)
  const amPm = !isGothicScript.value
    ? (isPm ? 'p.m.' : 'a.m.')
    : `<span class='overline'>${fromLatin(isPm ? 'pm' : 'am')}</span>`
  return fh + ' ' + amPm
}

function formatText(text: string)
{
  return !isGothicScript.value ? text : fromLatin(text)
}

function getDays()
{
  if (!data.value) return []
  const days: WithrDay[] = []
  for (let i=0; i<7; i++)
  {
    const day = new Date(data.value.daily.time[i]! + 'T00:00:00')
    const title = i == 0 ? today : weekdays[day.getDay()]!
    days.push({
      title,
      tempMax: formatTemp(data.value.daily.temperature_2m_max[i]),
      tempMin: formatTemp(data.value.daily.temperature_2m_min[i]),
      imageUrl: getOwmImageUrl(data.value.daily.weather_code[i] || 0, true)
    })
  }
  return days
}

function getDescription(weatherCode: number, isDay: boolean)
{
  const desc = weatherCodeDescription[weatherCode]
  return (
    typeof desc === "string" ? desc :
    typeof desc === "undefined" ? '?' :
    isDay ? desc.day : desc.night) || '?'
}

function getValue<Type>(value: Type|Type[], index: number)
{
  return Array.isArray(value) ? value[index] : value
}

/*

function getAmPm(date: Date)
{
  const isPm = date.getHours() >= 12
  return !options.isGothicScript
    ? (isPm ? 'p.m.' : 'a.m.')
    : `<span class='overline'>${fromLatin(isPm ? 'pm' : 'am')}</span>`
}

function get12Hour(date: Date)
{
  const hours = date.getHours()
  const h = (hours % 12) || 12
  return actualGothicNumeralMode.value == 'none'
    ? h : toGothicValue(h)
}

function get24Hour(date: Date)
{
  const hours = date.getHours()
  return actualGothicNumeralMode.value == 'full'
    ? toGothicValue(hours)
    : hours.toString().padStart(2, '0')
}
*/

function getGothicValue(value: number, minMode: GothicNumeralMode = 'mix')
{
  if (actualGothicNumeralMode.value == minMode
    || actualGothicNumeralMode.value == 'full')
    return toGothicValue(value)
  else
    return value.toString()
}

function formatDateTime(date: Date)
{
  /*
  const weekday = weekdays[date.getDay()]!.long
  const fWeekday = options.isGothicScript
    ? fromLatin(weekday) : weekday
  */
  const dom = getGothicValue(date.getDate())
  const monthName = months[date.getMonth()]!.long
  const fMonthName = isGothicScript.value
    ? fromLatin(monthName) : monthName
  const year = getGothicValue(date.getFullYear())
  return `${dom} ${fMonthName} ${year}`

  /*
  const hours = options.is24hour ? get24Hour(date) : get12Hour(date)
  const minutes = actualGothicNumeralMode.value != 'full'
    ? date.getMinutes().toString().padStart(2, '0') : toGothicValue(date.getMinutes())
  const seconds = actualGothicNumeralMode.value != 'full'
    ? date.getSeconds().toString().padStart(2, '0') : toGothicValue(date.getSeconds())
  const amPm = options.is24hour ? '' : ' ' + getAmPm(date)
  return `${fWeekday}, ${dom} ${fMonthName} ${year} ${hours}:${minutes}:${seconds}${amPm}`
  */

}

const uvIndexRiskMapping: [number, string][] = [
  [ 0, 'no-risk' ],
  [ 1, 'low' ],
  [ 3, 'moderate' ],
  [ 6, 'high' ],
  [ 8, 'very-high' ],
  [ 11, 'extreme' ],
]

function getHour(object: WeatherDataHour|WeatherDataHourly, index = -1): WithHourSimple
{
  const weatherCode = getValue(object.weather_code, index) || 0
  const isDay = !!getValue(object.is_day, index)

  const windDirection = getValue(object.wind_direction_10m, index)
  const date = new Date(getValue(object.time, index)!)

  const uvIndex = Math.round(getValue(object.uv_index, index)!)
  const uvIndexRisk = uvIndexRiskMapping[
    uvIndexRiskMapping.findIndex(([v,_]) => uvIndex < v)-1]![1]


  return {
    formattedDate: formatDateTime(date),

    isFoldedSectionVisible: false,

    description: getDescription(weatherCode, isDay),
    imageUrl: getOwmImageUrl(weatherCode, isDay),

    temp: formatTemp(getValue(object.temperature_2m, index)),
    apparentTemp: formatTemp(getValue(object.apparent_temperature, index)),
    uvIndex: getGothicValue(uvIndex),
    uvIndexRisk,

    precipitationProbability: '💧 ' + formatPercentage(getValue(object.precipitation_probability, index)),
    precipitation: formatPrecipitation(getValue(object.precipitation, index)),
    humidity: formatPercentage(getValue(object.relative_humidity_2m, index)),

    windSpeed: formatSpeed(getValue(object.wind_speed_10m, index)),
    windCompassDirection: formatCompassDirection(windDirection),
    windDirection: windDirection!,
  }
}


const selectedDayIndex = ref(0)

function getHours()
{
  if (!data.value || !currentTime.value) return []
  const startHour = selectedDayIndex.value == 0
    ? currentTime.value.getHours() : 0

  const hours: WithrHour[] = []
  for (let i=startHour; i<24; i++)
  {
    const hourIndex = i + 24 * selectedDayIndex.value
    const hour = new Date(data.value.hourly.time[hourIndex]!)
    hours.push({
      title: formatHour(hour),
      ...getHour(data.value.hourly, hourIndex)
    })
  }
  return hours
}

const days = computed(() => getDays())
const hours = ref<WithrHour[]>([])
watchEffect(() =>
{
  hours.value = getHours()
})
const current = computed(() => !data.value ? null : getHour(data.value.current))

const route = useRoute()

function handleCloseOptions()
{
  showOptions.value = !showOptions.value
  if (reloadData) getData()
}

watch(() => route.params.location, () =>
{
  const location = route.params.location
  if (!location || typeof location !== 'string')
  {
    data.value = null
    return
  }
  const splitLocation = location.split(":")

  const latLong = splitLocation[0]!.split(',')
  if (!latLong[1])
  {
    data.value = null
    return
  }

  placeName.value = splitLocation[1] ? splitLocation[1].replaceAll('_', ' ') : null

  lat.value = parseFloat(latLong[0]!)
  long.value = parseFloat(latLong[1])

  getData()
}, { immediate: true })

const isGeolocationAvailable = "geolocation" in navigator

const handlePositionSuccess: PositionCallback = (position) =>
{
  lat.value = position.coords.latitude
  long.value = position.coords.longitude
  geolocationLock.value = false
}

const handlePositionError: PositionErrorCallback = (error) =>
{
  alert("Unable to retrieve location: " + error.message)
  geolocationLock.value = false
}

const geolocationLock = ref(false)
function geolocate()
{
  if (geolocationLock.value) return
  geolocationLock.value = true
  navigator.geolocation.getCurrentPosition(
    handlePositionSuccess,
    handlePositionError
  )
}

function handleSetSearch(result: SearchResult)
{
  const pathEnd = !result.name ? '' : (':' + result.name.replaceAll(' ', '_'))
  router.replace(`/${result.lat},${result.long}${pathEnd}`)
  data.value = null
  getData()
  showSearch.value = false
}

const showSearch = ref(false)

/*
const currentDateTime = useTemplateRef('currentDateTime')

function displayDateTime()
{
  if (currentDateTime.value && utcOffsetSeconds.value !== null)
  {
    const date = getCurrentTimeFromOffset(utcOffsetSeconds.value)
    currentDateTime.value.innerHTML = formatDateTime(date)
  }
  setTimeout(displayDateTime, 1000 - (new Date()).getMilliseconds())
}
displayDateTime()
*/

const options = ref({
  is24hour, isGothicScript, gothicNumeralMode,
  tempUnit, windSpeedUnit, precipitationUnit
})

</script>

<template>
<div id="withr" :lang="isGothicScript ? 'got-Goth' : 'got-Latn'">
  <div id="withr-header">
    <div class="withr-title">
      <h1><RouterLink to="/">{{ formatText('Wiþr in Gutrazdai') }}</RouterLink></h1>
    </div>
  </div>
  <div v-if="isLoading">
    <div class=""></div>
  </div>
  <div v-else>
    <div id="withr-init-page">
      <div id="withr-options-section">
        <div class="withr-options">
          <button class="withr-search-button" @click="showSearch = true"></button>
          <button class='withr-geolocate-button' @click="geolocate" v-if='isGeolocationAvailable' :disabled="geolocationLock"></button>
          <button class='withr-options-button' @click="showOptions = !showOptions"></button>
        </div>
      </div>
      <div v-if="!data" id="withr-location-links" lang="en">
        <RouterLink to="/39.8581,-4.02263:Toledo">Toledo</RouterLink>
        <RouterLink to="/43.60426,1.44367:Toulouse">Toulouse</RouterLink>
        <RouterLink to="/45.19205,9.15917:Pavia">Pavia</RouterLink>
        <RouterLink to="/44.41344,12.20121:Ravenna">Ravenna</RouterLink>
        <RouterLink to="/45.51667,22.78333:Sarmizegetusa">Sarmizegetusa</RouterLink>
        <RouterLink to="/44.60795,33.52134:Sevastopol">Sevastopol</RouterLink>
      </div>
    </div>
    <div id="withr-display" v-if="data">
      <div id="withr-top">
        <div id="withr-current" v-if="current">
          <div class="withr-current-title">
            <span v-if="placeName">{{ formatText('Nū in') }} <span lang="en">{{ placeName }}</span></span>
            <span v-else>{{ formatText('Nū') }}</span></div>
          <div class="withr-current-content">
            <div class="withr-current-image">
              <img :src="current.imageUrl">
            </div>
            <div class="withr-current-details">
              <div class="withr-current-temp"><span v-html="current.temp"></span>{{ tempSymbols[dataTempUnit!] }}</div>
            </div>
          </div>
          <div class="withr-current-details-line">
            <div class="withr-current-description">{{ formatText(current.description) }}</div>
            <div class="withr-current-wind">
              <div class="withr-current-wind-direction" :style="{transform: `rotate(${180+current.windDirection}deg)`}">↑</div>
              <div class="withr-current-wind-compass-direction" v-html="current.windCompassDirection"></div>
              <div class="withr-current-wind-speed" v-html="current.windSpeed"></div>
            </div>
          </div>
          <div class="withr-current-datetime">
            <span v-html="current.formattedDate"></span>
          </div>
        </div>
      </div>
      <div id="withr-dow-row">
        <template v-for="(day, index) in days">
          <div :class="{ 'withr-dow-day': true,
              'withr-dow-day-selected': selectedDayIndex == index }"
              @click="selectedDayIndex = index">
            <div class="withr-dow-title">{{ formatText(day.title.long) }}</div>
            <div class="withr-dow-lower">
              <div class="withr-dow-image">
                <img :src="day.imageUrl">
              </div>
              <div class="withr-dow-temp">
                <div class="withr-dow-temp-max" v-html="day.tempMax"></div>
                <div class="withr-dow-temp-min" v-html="day.tempMin"></div>
              </div>
            </div>
          </div>
        </template>
      </div>
      <div id="withr-hours">
        <template v-for="hour in hours">
          <div class="withr-hour"
            @click="hour.isFoldedSectionVisible = !hour.isFoldedSectionVisible">
            <div>
              <div class="withr-hour-title" v-html="hour.title"></div>
              <div class="withr-hour-temp" v-html="hour.temp"></div>
              <div class="withr-hour-image">
                <img :src="hour.imageUrl">
              </div>
              <div class="withr-hour-description">{{ formatText(hour.description) }}</div>
            </div>
            <div>
              <div class="withr-hour-precipitation-probability" v-html="hour.precipitationProbability"></div>
              <div class="withr-hour-wind">
                <div class="withr-hour-wind-direction" :style="{transform: `rotate(${180+hour.windDirection}deg)`}">↑</div>
                <div class="withr-hour-wind-compass-direction" v-html="hour.windCompassDirection"></div>
                <div class="withr-hour-wind-speed" v-html="hour.windSpeed"></div>
              </div>
              <div class="withr-hour-fold-button">
                <span v-if="hour.isFoldedSectionVisible">-</span>
                <span v-else>+</span>
              </div>
            </div>
          </div>
          <div class="withr-hour-folded" v-if="hour.isFoldedSectionVisible">
            <div>
              <div>{{ formatText('Ufkunnaiþ') }}</div>
              <div class="withr-apparent-temp" v-html="hour.apparentTemp"></div>
            </div>
            <div>
              <div>{{ formatText('Wairþ') }} UV</div>
              <div class="withr-uv-index">
                <span v-html="hour.uvIndex"></span>
                <span :class="['withr-uv-index-' + hour.uvIndexRisk]"> ⬤</span>
              </div>
            </div>
            <div>
              <div>{{ formatText('Mitadjo Rignis') }}</div>
              <div class="withr-precipitation" v-html="hour.precipitation"></div>
            </div>
            <div>
              <div>{{ formatText('Qrammiþa Luftaus') }}</div>
              <div class="withr-humidity" v-html="hour.humidity"></div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <div id="footer" lang="en">
    <div></div>
    <div>
      By <a href="https://2sh.me/gothic">2sh</a> (2026). Weather & Geolocation data by <a href="https://open-meteo.com/">Open-Meteo</a>.
      <br>Any location data is sent directly from your browser to Open-Meteo only.
    </div>
  </div>
  <Search v-if="showSearch" @close="showSearch=false" @set="handleSetSearch"></Search>
  <Options v-if="showOptions" v-model="options" @close="handleCloseOptions"></Options>
</div>
</template>

<style>
@font-face {
  font-family: 'Noto Sans Gothic';
  src: url('../fonts/NotoSansGothic-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

body
{
  background-color: #28282b;
  color: #f0f0f0;
  margin: 0;
  padding: 0;
}

a
{
  color: #a7caff;
}

#footer
{
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  text-align: right;
}

.overline
{
  background-color: inherit;
  color: inherit;
  position: relative;
  display: inline-block;
  min-width: 10px;
  text-align: center;
}

.overline::before
{
  display: block;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 1.1em;
  height: 1px;
  content: "\a0";
  border-image-source: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAADCAYAAABF//VLAAAAAXNSR0IB2cksfwAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAACpJREFUCNdj/PDhw38GVNAoICDQwIAFMGJRjBMw4pL48OFDAwMDQz2yGAASjgyihLgjBwAAAABJRU5ErkJggg==");
  border-image-slice: 1 5 1 5 fill;
  border-width: 1px 3px;
  border-style: solid;
}
</style>

<style scoped>
#withr
{
  width: 800px;
  margin: 0 auto;
  font-family: sans;
  position: relative;
}

@media only screen and (max-width: 800px) {
  #withr
  {
    width: auto;
  }
}

h1
{
  margin: 0;
}

#withr-header
{
  margin-top: 10px;
}

.withr-title
{
  text-align: center;
  margin-bottom: 10px;
}

.withr-title a
{
  text-decoration: none;
  color: inherit;
}

#withr:lang(got-Goth)
{
  font-family: 'Noto Sans Gothic', sans;
}

#withr-top
{
  display: flex;
  justify-content: space-between;
}

#withr-options-section
{
  display: flex;
  justify-content: center;
  margin: 10px;
}

.withr-options button
{
  width: 35px;
  height: 35px;
  background-size: cover;
  background-position: center;
  background-color: #333;
  border: 5px solid #333;
  margin: 4px;
  cursor: pointer;
}

.withr-options button:hover
{
  background-color: #3a3a3a;
  border-color: #3a3a3a;
}

#withr-location-links
{
  width: 300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
}

#withr-location-links > a
{
  margin: 5px;
  text-align: center;
  padding: 10px;
  background-color: #333;
  text-decoration: none;
  color: inherit;
}

#withr-location-links > a:hover
{
  background-color: #3a3a3a;
}

.withr-geolocate-button
{
  background-image: url('../assets/images/pin.svg')
}

.withr-search-button
{
  background-image: url('../assets/images/search.svg')
}

.withr-options-button
{
  background-image: url('../assets/images/gear.svg')
}

#withr-current
{
  margin-bottom: 10px;
}

.withr-current-title
{
  font-size: 26px;
  padding-left: 30px;
  font-weight: bold;
}

.withr-current-content
{
  display: flex;
  align-items: center;
}

.withr-current-details
{
  display: flex;
  gap: 20px;
  font-size: 40px;
  align-items: end;
}

.withr-current-details-line
{
  display: flex;
  gap: 15px;
  align-items: baseline;
}

.withr-current-datetime
{
  margin-top: 5px;
}

.withr-current-wind
{
  display: flex;
  gap: 5px;
  font-size: 20px;
}

.withr-current-image
{
  margin: -15px 0;
}

.withr-current-description
{
  padding-left: 20px;
  font-size: 22px;
}

#withr-dow-row
{
  display: flex;
  gap: 4px;
  overflow-x: auto;
  overflow-y: hidden;
}

.withr-dow-day
{
  flex: 1 1 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-top: 10px;

  background-color: #333;
  color: #f0f0f0;
  cursor: pointer;

  border-bottom: 4px solid #333;
}

.withr-dow-day:hover
{
  background-color: #3a3a3a;
  border-bottom-color: #3a3a3a;
}

.withr-dow-day-selected
{
  border-bottom-color: rgb(255, 187, 0);
}

.withr-dow-day-selected:hover
{
  border-bottom-color: rgb(255, 187, 0);
}

.withr-dow-title
{
  text-align: center;
  white-space: nowrap;
  font-size: 16px;
}

.withr-dow-title:lang(got-Goth)
{
  font-size: 14px;
}

.withr-dow-lower
{
  display: flex;
  align-items: center;
  justify-content: center;
}

.withr-dow-temp
{
  text-align: right;
  white-space: nowrap;
}

.withr-dow-temp-max
{
  font-size: 17px;
  font-weight: bold;
  white-space: nowrap;
}

.withr-dow-image
{
  text-align: center;
  margin: -10px;
}

.withr-dow-image img
{
  height: 80px;
}

.withr-hour
{
  display: flex;
  align-items: center;
  margin: 5px 0;
  padding: 5px 7px;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 5px;

  background-color: #333;
  color: #f0f0f0;
  cursor: pointer;
}

.withr-hour:hover
{
  background-color: #3a3a3a;
}

.withr-hour > div
{
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: nowrap;
  flex: 1;
}

.withr-hour > div:last-child
{
  justify-content: flex-end;
}

.withr-hour-title
{
  width: 70px;
  text-align: right;
}

.withr-hour-temp
{
  width: 40px;
  text-align: right;
  white-space: nowrap;
}

.withr-hour-image
{
  text-align: center;
  margin: -5px 0;
}

.withr-hour-image img
{
  height: 40px;
  margin: -4px;
}

.withr-hour-description
{
  flex-grow: 1;
}

.withr-hour-precipitation-probability
{
  width: 60px;
  text-align: left;
  white-space: nowrap;
}

.withr-hour-wind
{
  display: flex;
  gap: 5px;
  width: 130px;
  justify-content: left;
}

.withr-hour-fold-button
{
  color: white;
  margin-right: 4px;
  width: 10px;
  text-align: center;
}

.withr-hour-folded
{
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}

.withr-hour-folded > div
{
  text-align: center;
  flex: 1 1 0px;
  background-color: #333;
  white-space: nowrap;
}

.withr-hour-folded > div > div
{
  margin: 5px;
}

@media only screen and (max-width: 700px) {
  .withr-hour-folded > div
  {
    flex: 1 1 45%;
  }
}

.withr-uv-index-no-risk
{
}

.withr-uv-index-low
{
  color: #00ff00;
}

.withr-uv-index-moderate
{
  color: yellow;
}

.withr-uv-index-high
{
  color: orange;
}

.withr-uv-index-very-high
{
  color: red;
}

.withr-uv-index-extreme
{
  color: violet;
}

</style>
