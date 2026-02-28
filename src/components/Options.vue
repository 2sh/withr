<script setup lang="ts">

import type {
  WithrOptions,
} from '../types'

const options = defineModel<WithrOptions>()
const emit = defineEmits(['close'])

</script>

<template>
<div class="window-section" v-if="options" lang="en">
  <div class="window-overlay"></div>
  <div class="window-box">

    <div class="window-header">
      <div>
        <p>Preferences</p>
      </div>
      <div>
        <button class="window-close-button" @click="$emit('close')">X</button>
      </div>
    </div>

    <div class="window-content">

      <div class="withr-options-section">
        <div class="withr-options-option">
          <div class="withr-options-name">
            Color Scheme
          </div>
          <div class="withr-options-value">
            <select v-model="options.colorScheme">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
            </select>
          </div>
        </div>
      </div>

      <div class="withr-options-section">
        <div class="withr-options-option">
          <div class="withr-options-name">
            Gothic Script
          </div>
          <div class="withr-options-value">
            <input type="checkbox" v-model="options.isGothicScript">
          </div>
        </div>
        <div class="withr-options-option" v-if="options.isGothicScript">
          <div class="withr-options-name">
            Gothic Numerals
          </div>
          <div class="withr-options-value">
            <select v-model="options.gothicNumeralMode">
              <option value="none">none</option>
              <option value="mix">Mix</option>
              <option value="full">Full</option>
            </select>
          </div>
        </div>
      </div>

      <div class="withr-options-section">
        <div class="withr-options-option">
          <div class="withr-options-name">
            24-hour Clock
          </div>
          <div class="withr-options-value">
            <input type="checkbox" v-model="options.is24hour">
          </div>
        </div>
      </div>

      <div class="withr-options-section">
        <div class="withr-options-option">
          <div class="withr-options-name">
            Temperature Units
          </div>
          <div class="withr-options-value">
            <select v-model="options.tempUnit">
              <option value="celsius">Celsius (°C)</option>
              <option value="fahrenheit">Fahrenheit (°F)</option>
            </select>
          </div>
        </div>
        <div class="withr-options-option">
          <div class="withr-options-name">
            Wind Speed Units
          </div>
          <div class="withr-options-value">
            <select v-model="options.windSpeedUnit">
              <option value="kmh">Kilometres per hour (km/h)</option>
              <option value="mph">Miles per hour (mph)</option>
              <option value="ms">Metres per second (m/s)</option>
              <option value="kn">Knots</option>
            </select>
          </div>
        </div>
        <div class="withr-options-option">
          <div class="withr-options-name">
            Precipitation Units
          </div>
          <div class="withr-options-value">
            <select v-model="options.precipitationUnit">
              <option value="mm">Millimeters (mm)</option>
              <option value="inch">Inch</option>
            </select>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>
</template>

<style scoped>

.withr-options-section
{
  margin: 5px 0;
}

.withr-options-option
{
  display: flex;
}

.withr-options-name
{
  width: 180px;
  text-align: right;
  margin-right: 5px;
}

</style>
