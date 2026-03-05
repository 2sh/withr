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
  SpeedUnit,
  GothicNumeralMode,
  PrecipitationUnit,
  Theme
} from '../types'

import {
  computed,
  ref,
  watch,
  watchEffect,
} from 'vue'

import {
  angleToCompassIndex,
  determineUnits,
  distanceConversionMap,
  owmKeyMapping,
  speedConverionMap,
  temperatureConversionMap,
  uvIndexRiskMapping
} from '../weather_tools'


import Options from '../components/Options.vue'
import Search from '../components/Search.vue'
import { useLocalStorage } from '@vueuse/core'
import { useRoute } from 'vue-router'
import router from '@/router'

const route = useRoute()

import { useTranslation } from "i18next-vue";
import { addOverlineHtml, toGothicValue } from '@/gothic_tools'
import { setBodyClass } from '@/tools'
const { i18next, t } = useTranslation();

import * as Astronomy from "astronomy-engine"


const determinedUnits = determineUnits()

const is24hour = useLocalStorage('is_24_hour', false)
const isGothicScript = useLocalStorage('is_gothic_script', true)
const gothicNumeralMode = useLocalStorage<GothicNumeralMode>('gothic_numeral_mode', 'full')

const tempUnit = useLocalStorage<TempUnit>('temp_unit',
  determinedUnits.isFahrenheit ? 'fahrenheit' : 'celsius')
const windSpeedUnit = useLocalStorage<SpeedUnit>('wind_speed_unit',
  determinedUnits.isImperial ? 'mph' : 'kmh')
const precipitationUnit = useLocalStorage<PrecipitationUnit>('precipitation_unit',
  determinedUnits.isImperial ? 'inch' : 'mm')

/* gothic script switch */

watch(isGothicScript, v =>
{
  document.body.setAttribute("lang", v ? 'got-Goth' : 'got-Latn')
})

function setLanguage()
{
  i18next.changeLanguage(isGothicScript.value ? 'got-Goth' : 'got-Latn')
}
setLanguage()
watch(isGothicScript, setLanguage)


/* theme */

const theme = useLocalStorage<Theme>('theme',
  (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches
  ? 'light' : 'dark')
)

function setTheme()
{
  document.documentElement.dataset.theme = theme.value
  setBodyClass(theme.value, "withr-theme-")
}
watch(theme, setTheme)
setTheme()

/* data retrieval */

const lat = ref<number | null>(null)
const long = ref<number | null>(null)
const placeName = ref<string | null>(null)

const data = ref<WeatherData | null>(null)
const currentTime = computed(() => data.value ? new Date(data.value.current.time) : null)
const astroObserver = computed(() => !data.value || !lat.value || !long.value ? null
  : new Astronomy.Observer(lat.value, long.value, data.value.elevation))

const isLoading = ref(false)
let reloadData = false // unused for now

async function getData()
{
  if (lat.value === null || long.value === null) return

  isLoading.value = true

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

  const response = await fetch(url)
  data.value = await response.json()
  reloadData = false
  isLoading.value = false
}


/* format functions */

const actualGothicNumeralMode = computed(() =>
  !isGothicScript.value ? 'none' : gothicNumeralMode.value)

function getGothicValue(value: number, minMode: GothicNumeralMode = 'mix')
{
  if (actualGothicNumeralMode.value == minMode
    || actualGothicNumeralMode.value == 'full')
    return toGothicValue(value)
  else
    return value.toString()
}

function formatTemp(value: number | undefined)
{
  if (typeof value === 'undefined') return '?'
  const cValue = tempUnit.value == 'celsius'
    ? value : temperatureConversionMap[tempUnit.value]!(value)
  const rValue = Math.round(cValue)
  const fValue = getGothicValue(rValue, 'full')
  return fValue + '°' || ''
}

function formatPercentage(value: number | undefined)
{
  if (typeof value === 'undefined') return '?'
  const fValue = getGothicValue(value, 'full')
  return fValue + '%' || ''
}

function formatSpeed(value: number | undefined)
{
  if (typeof value === 'undefined') return '?'
  const cValue = windSpeedUnit.value == 'kmh'
    ? value : speedConverionMap[windSpeedUnit.value]!(value)
  const rValue = Math.round(cValue)
  const fValue = getGothicValue(rValue, 'full')
  return fValue + t('windSpeedSymbols.' + windSpeedUnit.value) || ''
}

function formatCompassDirection(value: number | undefined)
{
  if (typeof value === 'undefined') return ''
  const index = angleToCompassIndex(value)
  const direction = t('compassDirections.' + index) || ''
  const fValue = !isGothicScript.value
    ? direction : addOverlineHtml(direction)
  return fValue
}

function formatPrecipitation(value: number | undefined)
{
  if (typeof value === 'undefined') return '?'
  const cValue = precipitationUnit.value == 'mm'
    ? value : distanceConversionMap[precipitationUnit.value]!(value)
  const denominator = precipitationUnit.value == 'inch' ? 1000 : 10
  const fValue = actualGothicNumeralMode.value == 'full'
    ? toGothicValue(cValue, denominator)
    : Math.round(cValue*denominator) / denominator
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
  const fh = getGothicValue(h)
  const amPm = isPm ? t('ui.pm') : t('ui.am')
  const fAmPm = !isGothicScript.value
    ? amPm
    : addOverlineHtml(amPm)
  return fh + ' ' + fAmPm
}

function formatDate(date: Date)
{
  const dom = getGothicValue(date.getDate())
  const monthName = t(`months.${date.getMonth()}.long`)
  const year = getGothicValue(date.getFullYear())
  return `${dom} ${monthName} ${year}`
}


/* page data */

function getDays()
{
  if (!data.value) return []

  const days: WithrDay[] = []
  for (let i=0; i<7; i++)
  {
    const day = new Date(data.value.daily.time[i]! + 'T00:00:00')
    const title = i == 0
      ? t('today.long') : t(`weekdays.${day.getDay()}.long`)
    const conditionKey = owmKeyMapping[data.value.daily.weather_code[i]!]!
    const classes = [
      `withr-section-condition-${conditionKey.replaceAll('_', '-')}`,
      'withr-section-is-day',
    ]
    days.push({
      title,
      tempMax: formatTemp(data.value.daily.temperature_2m_max[i]),
      tempMin: formatTemp(data.value.daily.temperature_2m_min[i]),
      conditionKey,
      classes,
    })
  }
  return days
}

function getValue<Type>(value: Type|Type[], index: number)
{
  return Array.isArray(value) ? value[index] : value
}

function getMoonVisiblity(date: Date)
{
  if (!astroObserver.value) return false
  const moonRise = Astronomy.SearchRiseSet(Astronomy.Body.Moon, astroObserver.value, -1, date, 1)
  const moonSet = Astronomy.SearchRiseSet(Astronomy.Body.Moon, astroObserver.value, 1, date, 1)
  if (!moonRise || !moonSet) return false
  return moonRise.date < moonSet.date
}

function addHalfHour(date: Date)
{
  const newDate = new Date(date)
  newDate.setMinutes(30)
  return newDate
}

function getHour(object: WeatherDataHour|WeatherDataHourly, index = -1,
  contextIsFullHour=false): WithHourSimple
{
  const weatherCode = getValue(object.weather_code, index) || 0
  const isDay = !!getValue(object.is_day, index)

  const windDirection = getValue(object.wind_direction_10m, index)
  const date = new Date(getValue(object.time, index)!)

  const uvIndex = Math.round(getValue(object.uv_index, index)!)
  const uvIndexRisk = uvIndexRiskMapping[
    uvIndexRiskMapping.findIndex(([v,_]) => uvIndex < v)-1]![1]

  const targetDate = contextIsFullHour ? addHalfHour(date) : date
  const isMoonVisible = getMoonVisiblity(targetDate)

  const conditionKey = owmKeyMapping[weatherCode]!

  const classes = [
    `withr-section-condition-${conditionKey.replaceAll('_', '-')}`,
    `withr-section-is-${isDay ? 'day' : 'night'}`,
  ]
  if (isMoonVisible)
    classes.push('withr-section-moon')

  return {
    formattedDate: formatDate(date),

    isFoldedSectionVisible: false,

    conditionKey,
    isDay,

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

    isMoonVisible,

    classes,
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
      ...getHour(data.value.hourly, hourIndex, true)
    })
  }
  return hours
}

const days = computed(() => getDays())
const hours = ref<WithrHour[]>([])
watchEffect(() => { hours.value = getHours() })
const current = computed(() => !data.value ? null : getHour(data.value.current))

watch(() => current.value ? current.value.conditionKey : null,
  conditionKey => setBodyClass(conditionKey, 'withr-page-current-condition-'))

watch(() => current.value ? current.value.isDay : null,
  isDay => setBodyClass(isDay ? 'day' : 'night', 'withr-page-current-is-'))

watch(() => current.value ? current.value.isMoonVisible : null,
  isMoonVisible => document.body.classList.toggle('withr-page-current-moon', !!isMoonVisible))

/* routing */

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


/* geolocation */

const isGeolocationAvailable = "geolocation" in navigator
const geolocationLock = ref(false)

const handlePositionSuccess: PositionCallback = async (position) =>
{
  const lat = position.coords.latitude.toFixed(5)
  const long = position.coords.longitude.toFixed(5)
  router.replace(`/${lat},${long}`)
  geolocationLock.value = false
}

const handlePositionError: PositionErrorCallback = (error) =>
{
  alert("Unable to retrieve location: " + error.message)
  geolocationLock.value = false
}

function geolocate()
{
  if (geolocationLock.value) return
  geolocationLock.value = true
  navigator.geolocation.getCurrentPosition(
    handlePositionSuccess,
    handlePositionError,
    {
      maximumAge: 10000,
      timeout: 10000,
      enableHighAccuracy:true,
    }
  )
}

/* search box */

const showSearch = ref(false)

function handleSetSearch(result: SearchResult)
{
  const pathEnd = !result.name ? '' : (':' + result.name.replaceAll(' ', '_'))
  router.replace(`/${result.lat},${result.long}${pathEnd}`)
  data.value = null
  getData()
  showSearch.value = false
}

/* options box */

const showOptions = ref(false)

function handleCloseOptions()
{
  showOptions.value = !showOptions.value
  if (reloadData) getData()
}

const options = ref({
  is24hour, isGothicScript, gothicNumeralMode,
  tempUnit, windSpeedUnit, precipitationUnit,
  theme,
})

</script>

<template>
<div class="article" :lang="isGothicScript ? 'got-Goth' : 'got-Latn'">
  <div id="header">
    <div class="header-title">
      <h1><RouterLink to="/">{{ t('ui.weather_in_gothic') }}</RouterLink></h1>
    </div>
  </div>
  <div v-if="isLoading">
    <div class="loading-image"></div>
  </div>
  <div v-else>
    <div id="withr-options-section">
      <div class="withr-options">
        <button class="withr-search-button" @click="showSearch = true"><div></div></button>
        <button class='withr-geolocate-button' @click="geolocate" v-if='isGeolocationAvailable' :disabled="geolocationLock"><div></div></button>
        <button class='withr-options-button' @click="showOptions = !showOptions"><div></div></button>
      </div>
    </div>
    <div  v-if="!data" id="withr-init-page">
      <div id="withr-location-links" lang="en">
        <RouterLink to="/39.8581,-4.02263:Toledo">Toledo</RouterLink>
        <RouterLink to="/43.60426,1.44367:Toulouse">Toulouse</RouterLink>
        <RouterLink to="/45.19205,9.15917:Pavia">Pavia</RouterLink>
        <RouterLink to="/44.41344,12.20121:Ravenna">Ravenna</RouterLink>
        <RouterLink to="/45.51667,22.78333:Sarmizegetusa">Sarmizegetusa</RouterLink>
        <RouterLink to="/44.60795,33.52134:Sevastopol">Sevastopol</RouterLink>
      </div>
    </div>
    <div v-if="data" id="withr-display">
      <div id="withr-top">
        <div id="withr-current" v-if="current" :class="current.classes">
          <div class="withr-current-title">
            <span v-if="placeName">{{ t("ui.now_in") }} <span lang="en">{{ placeName }}</span></span>
            <span v-else>{{ t("ui.now") }}</span></div>
          <div class="withr-current-content">
            <div class="withr-condition-image">
            </div>
            <div class="withr-current-details">
              <div class="withr-current-temp"><span v-html="current.temp"></span>{{ $t('tempSymbols.' + tempUnit) }}</div>
            </div>
          </div>
          <div class="withr-current-details-line">
            <div class="withr-current-description">{{
              $t("conditionDescription." + current.conditionKey, {
                context: current.isDay ? 'day' : 'night'
              }) }}</div>
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
          <div :class="[ 'withr-dow',
            ...day.classes,
            { 'withr-dow-day': true, 'withr-dow-day-selected': selectedDayIndex == index }]"
              @click="selectedDayIndex = index">
            <div class="withr-dow-title">{{ day.title }}</div>
            <div class="withr-dow-lower">
              <div class="withr-condition-image"></div>
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
          <div :class="['withr-hour', ...hour.classes]"
            @click="hour.isFoldedSectionVisible = !hour.isFoldedSectionVisible">
            <div>
              <div class="withr-hour-title" v-html="hour.title"></div>
              <div class="withr-hour-temp" v-html="hour.temp"></div>
              <div class="withr-condition-image"></div>
              <div class="withr-hour-description">{{
                $t("conditionDescription." + hour.conditionKey, {
                  context: hour.isDay ? 'day' : 'night'
                }) }}</div>
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
      <span class="no-wrap">By <a href="https://2sh.me/gothic">2sh</a> (2026).</span> <span
        class="no-wrap">Weather & Geolocation data by <a href="https://open-meteo.com/">Open-Meteo</a>.</span>
      <br>Any location data is sent directly from your browser to Open-Meteo only.
    </div>
  </div>
  <Search v-if="showSearch" @close="showSearch=false" @set="handleSetSearch"></Search>
  <Options v-if="showOptions" v-model="options" @close="handleCloseOptions"></Options>
</div>
</template>
