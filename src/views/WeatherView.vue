<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY
const city = ref('')
const weatherData = ref(null)
const error = ref('')
const loading = ref(false)

const temperature = computed(() =>
  weatherData.value ? Math.round(weatherData.value.main.temp * 10) / 10 : null
)
const iconUrl = computed(() => {
  const icon = weatherData.value?.weather?.[0]?.icon
  return icon ? `https://openweathermap.org/img/wn/${icon}@2x.png` : ''
})
const description = computed(() => weatherData.value?.weather?.[0]?.description || '')

async function fetchWeather(params) {
  if (!apiKey) {
    error.value = 'OpenWeatherMap API key is not configured.'
    return
  }

  loading.value = true
  error.value = ''
  weatherData.value = null
  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: { ...params, appid: apiKey, units: 'metric' },
      timeout: 15000
    })
    weatherData.value = response.data
  } catch (requestError) {
    const status = requestError.response?.status
    error.value =
      status === 404
        ? 'City not found. Try a name such as Clayton, AU.'
        : 'Unable to retrieve weather. Please try again.'
  } finally {
    loading.value = false
  }
}

function searchByCity() {
  const query = city.value.trim()
  if (!query) {
    error.value = 'Enter a city name first.'
    return
  }
  fetchWeather({ q: query })
}

function fetchCurrentLocationWeather() {
  if (!navigator.geolocation) {
    error.value = 'Geolocation is not supported by this browser.'
    return
  }

  loading.value = true
  error.value = ''
  navigator.geolocation.getCurrentPosition(
    ({ coords }) => fetchWeather({ lat: coords.latitude, lon: coords.longitude }),
    () => {
      loading.value = false
      error.value = 'Location permission was not granted. Search by city instead.'
    },
    { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
  )
}

onMounted(fetchCurrentLocationWeather)
</script>

<template>
  <section class="weather-card mx-auto mt-4">
    <div class="weather-heading text-center">
      <span class="eyebrow">LIVE WEATHER</span>
      <h1>Weather App</h1>
      <p>View local conditions or search for any city.</p>
    </div>

    <form class="search-bar" @submit.prevent="searchByCity">
      <label for="city" class="visually-hidden">City</label>
      <input
        id="city"
        v-model="city"
        class="form-control"
        placeholder="Enter city, e.g. Clayton, AU"
      />
      <button class="btn btn-primary" type="submit" :disabled="loading">
        {{ loading ? 'Loading…' : 'Search' }}
      </button>
      <button
        class="btn btn-outline-secondary"
        type="button"
        :disabled="loading"
        @click="fetchCurrentLocationWeather"
      >
        Use my location
      </button>
    </form>

    <p v-if="error" class="alert alert-warning mt-4" role="alert">{{ error }}</p>

    <article v-if="weatherData" class="weather-result" aria-live="polite">
      <div>
        <p class="location-label">CURRENT CONDITIONS</p>
        <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
        <p class="description">{{ description }}</p>
      </div>
      <div class="weather-reading">
        <img v-if="iconUrl" :src="iconUrl" :alt="description" />
        <strong>{{ temperature }}°C</strong>
      </div>
    </article>
  </section>
</template>

<style scoped>
.weather-card {
  max-width: 860px;
  padding: 2rem;
  border-radius: 1.5rem;
  background: linear-gradient(145deg, #fff, #edf6ff);
  box-shadow: 0 20px 55px rgba(30, 64, 175, 0.12);
}
.weather-heading h1 {
  margin: 0.4rem 0;
  font-size: clamp(2.25rem, 6vw, 4.5rem);
  text-transform: uppercase;
}
.eyebrow,
.location-label {
  color: #2563eb;
  font-size: 0.78rem;
  font-weight: 800;
  letter-spacing: 0.16em;
}
.search-bar {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto auto;
  gap: 0.75rem;
  margin-top: 2rem;
}
.weather-result {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 2rem;
  padding: 1.75rem;
  border-radius: 1rem;
  background: #fff;
}
.weather-result h2 {
  margin: 0.2rem 0;
}
.description {
  margin: 0;
  color: #64748b;
  text-transform: capitalize;
}
.weather-reading {
  display: flex;
  align-items: center;
}
.weather-reading img {
  width: 90px;
  height: 90px;
}
.weather-reading strong {
  font-size: 2.75rem;
  white-space: nowrap;
}
@media (max-width: 700px) {
  .search-bar {
    grid-template-columns: 1fr;
  }
  .weather-result {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
