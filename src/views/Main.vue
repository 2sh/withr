<script setup lang="ts">

import type {
  WeatherData,
  WeatherDataHour,
  WeatherDataHourly,
  WithHourSimple,
  WithrDay,
  WithrHour,
  SearchResult,
  TempUnit,
  WindSpeedUnit,
  GothicNumeralMode,
  PrecipitationUnit,
  ColorScheme
} from '../types'

import {
  computed,
  ref,
  watch,
  watchEffect
} from 'vue'

import {
  determineUnits,
  getOwmImageUrl
} from '../weather_tools'
import {
  toGothicNumerals
} from '../transliterate'


import Options from '../components/Options.vue'
import Search from '../components/Search.vue'
import { useLocalStorage } from '@vueuse/core'
import { useRoute } from 'vue-router'
import router from '@/router'

import { useTranslation } from "i18next-vue";
const { i18next, t } = useTranslation();

const showOptions = ref(false)

const determinedUnits = determineUnits()

const is24hour = useLocalStorage('is_24_hour', false)
const isGothicScript = useLocalStorage('is_gothic_script', true)
const gothicNumeralMode = useLocalStorage<GothicNumeralMode>('gothic_numeral_mode', 'full')

const tempUnit = useLocalStorage<TempUnit>('temp_unit',
  determinedUnits.isFahrenheit ? 'fahrenheit' : 'celsius')
const windSpeedUnit = useLocalStorage<WindSpeedUnit>('wind_speed_unit',
  determinedUnits.isImperial ? 'mph' : 'kmh')
const precipitationUnit = useLocalStorage<PrecipitationUnit>('precipitation_unit',
  determinedUnits.isImperial ? 'inch' : 'mm')

/* dark mode */

const colorScheme = useLocalStorage<ColorScheme>('color_scheme',
  document.documentElement.dataset.colorScheme == 'light' ? 'light' : 'dark'
)

window.matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', event => {
    colorScheme.value = event.matches ? 'dark' : 'light';
  });

function setColorScheme()
{
  document.documentElement.dataset.colorScheme = colorScheme.value
}
watch(colorScheme, setColorScheme)
setColorScheme()

/* dark mode end */

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

function setLanguage()
{
  i18next.changeLanguage(isGothicScript.value ? 'got-Goth' : 'got-Latn')
}
setLanguage()
watch(isGothicScript, setLanguage)

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
  return fValue + t('windSpeedSymbols.' + dataWindSpeedUnit) || ''
}

function formatCompassDirection(value: number | undefined)
{
  if (typeof value === 'undefined') return ''
  const index = Math.round(((value %= 360) < 0 ? value + 360 : value) / 22.5) % 16
  const direction = t('compassDirections.' + index) || ''
  const fValue = !isGothicScript.value ? direction : `<span class='overline'>${direction}</span>`
  return fValue
}

function formatPrecipitation(value: number | undefined)
{
  if (typeof value === 'undefined') return '?'
  const rValue = Math.round(value)
  const fValue = actualGothicNumeralMode.value == 'full'
    ? toGothicValue(rValue) : rValue.toString()
  return fValue + t('precipitationSymbols.' + precipitationUnit.value) || ''
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
  const amPm = isPm ? t('ui.am') : t('ui.pm')
  const fAmPm = !isGothicScript.value
    ? amPm
    : `<span class='overline'>${amPm}</span>`
  return fh + ' ' + fAmPm
}

function getDays()
{
  if (!data.value) return []
  const days: WithrDay[] = []
  for (let i=0; i<7; i++)
  {
    const day = new Date(data.value.daily.time[i]! + 'T00:00:00')
    const title = i == 0
      ? t('today.long') : t(`weekdays.${day.getDay()}.long`)
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
  const desc = t("weatherCodeDescription." + weatherCode, {context: isDay ? 'day' : 'night'})
  return desc
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
  const monthName = t(`months.${date.getMonth()}.long`)
  const year = getGothicValue(date.getFullYear())
  return `${dom} ${monthName} ${year}`

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
  tempUnit, windSpeedUnit, precipitationUnit,
  colorScheme,
})

</script>

<template>
<div id="withr" :lang="isGothicScript ? 'got-Goth' : 'got-Latn'">
  <div id="withr-header">
    <div class="withr-title">
      <h1><RouterLink to="/">{{ t('ui.weather_in_gothic') }}</RouterLink></h1>
    </div>
  </div>
  <div v-if="isLoading">
    <div class=""></div>
  </div>
  <div v-else>
    <div id="withr-init-page">
      <div id="withr-options-section">
        <div class="withr-options">
          <button class="withr-search-button" @click="showSearch = true"><div></div></button>
          <button class='withr-geolocate-button' @click="geolocate" v-if='isGeolocationAvailable' :disabled="geolocationLock"><div></div></button>
          <button class='withr-options-button' @click="showOptions = !showOptions"><div></div></button>
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
            <span v-if="placeName">{{ t("ui.now_in") }} <span lang="en">{{ placeName }}</span></span>
            <span v-else>{{ t("ui.now") }}</span></div>
          <div class="withr-current-content">
            <div class="withr-current-image">
              <img :src="current.imageUrl">
            </div>
            <div class="withr-current-details">
              <div class="withr-current-temp"><span v-html="current.temp"></span>{{ $t('tempSymbols.' + dataTempUnit) }}</div>
            </div>
          </div>
          <div class="withr-current-details-line">
            <div class="withr-current-description">{{ current.description }}</div>
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
            <div class="withr-dow-title">{{ day.title }}</div>
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
              <div class="withr-hour-description">{{ hour.description }}</div>
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
              <div>{{ $t("ui.apparent_temp") }}</div>
              <div class="withr-apparent-temp" v-html="hour.apparentTemp"></div>
            </div>
            <div>
              <div>{{ $t("ui.uv_index") }}</div>
              <div class="withr-uv-index">
                <span v-html="hour.uvIndex"></span>
                <span :class="['withr-uv-index-' + hour.uvIndexRisk]"> ⬤</span>
              </div>
            </div>
            <div>
              <div>{{ $t("ui.precipitation") }}</div>
              <div class="withr-precipitation" v-html="hour.precipitation"></div>
            </div>
            <div>
              <div>{{ $t("ui.humidity") }}</div>
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
  src: url('../assets/fonts/NotoSansGothic-Regular.woff2') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}

body
{
  background-color: var(--bg-color);
  color: var(--text-color);
  margin: 0;
  padding: 0;
}

a
{
  color: var(--link-color);
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
  filter: invert(var(--inverse));
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
  background-color: var(--button-color);
  border: 0;
  margin: 5px;
  cursor: pointer;
  padding: 5px;
}

.withr-options button div
{
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  filter: invert(var(--inverse));
}

.withr-options button:hover
{
  background-color: var(--button-color-hover);
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
  background-color: var(--button-color);
  text-decoration: none;
  color: inherit;
}

#withr-location-links > a:hover
{
  background-color: var(--button-color-hover);
}

.withr-geolocate-button div
{
  background-image: url('../assets/images/pin.svg')
}

.withr-search-button div
{
  background-image: url('../assets/images/search.svg')
}

.withr-options-button div
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

  background-color: var(--button-color);
  cursor: pointer;

  border-bottom: 4px solid var(--button-color);
}

.withr-dow-day:hover
{
  background-color: var(--button-color-hover);
  border-bottom-color: var(--button-color-hover);
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
  text-align: center;
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

  background-color: var(--button-color);
  cursor: pointer;
}

.withr-hour:hover
{
  background-color: var(--button-color-hover);
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
  background-color: var(--box-color);
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
