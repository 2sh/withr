<script setup lang="ts">
import type { SearchResult } from '@/types'
import { ref, watch } from 'vue'

type GeocodingApiItem = {
  name: string,
  latitude: number,
  longitude: number,
  country_code: string,
  admin1: string,
}

type GeocodingApiResult = {
  results?: GeocodingApiItem[]
}


const emit = defineEmits(['close', 'set'])

const searchTerm = ref<string>('')
const searchResults = ref<SearchResult[]>([])

let isSearching = false

async function queryLocation(name: string)
{
  if (isSearching) return
  isSearching = true
  queryTimeoutId = null
  const url = "https://geocoding-api.open-meteo.com/v1/search?"
  + "name=" + name
  + "&count=10&language=en&format=json"
  const response = await fetch(url)
  const data: GeocodingApiResult = await response.json()
  if (data.results) searchResults.value = data.results.map((result) =>
  {
    return {
      title: result.name + ', ' + result.admin1,
      name: result.name,
      lat: result.latitude,
      long: result.longitude,
    }
  })
  isSearching = false
}

let queryTimeoutId: number | null = null

async function processSearchTerm(immediate = false)
{
  searchResults.value = []
  if (searchTerm.value.match('^[0-9., -]+$'))
  {
    const matches = searchTerm.value.match('(-?[0-9]*\.[0-9]+)(?:, *| +)(-?[0-9]*\.[0-9]+)')
    if (matches)
    {
      searchResults.value = [{
        title: "Coordinates",
        lat: parseFloat(matches[1]!),
        long: parseFloat(matches[2]!),
      }]
    }
    return
  }
  if (searchTerm.value.length >= 3)
  {
    if (queryTimeoutId != null)
      clearTimeout(queryTimeoutId)
    if (immediate)
      queryLocation(searchTerm.value)
    else
      queryTimeoutId = setTimeout(()=>queryLocation(searchTerm.value), 500)
  }
}

watch(searchTerm, () => processSearchTerm())

function handleResultClick(index: number)
{
  const result = searchResults.value[index]!
  emit('set', result)
}

</script>

<template>
<div class="window-section" lang="en">
  <div class="window-overlay"></div>
  <div class="window-box">
    <div class="window-header">
      <div>
        <p>Search</p>
      </div>
      <div>
        <button class="window-close-button" @click="$emit('close')">X</button>
      </div>
    </div>
    <div class="window-content">
      <div class="window-search-input">
        <input type="text" v-model="searchTerm"
          placeholder="Search for a place or enter coordinates"
          @keyup.enter="processSearchTerm(true)">
      </div>
      <div class="window-search-results">
        <div class="window-search-result" v-for="(result, index) in searchResults"
          @click="handleResultClick(index)">
          <div class="window-search-result-title">{{ result.title }}</div>
          <div class="window-search-result-latlong">{{ result.lat.toFixed(5) }}, {{ result.long.toFixed(5) }}</div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>


</style>
