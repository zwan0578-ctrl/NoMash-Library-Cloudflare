<script setup>
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'

const jsonData = ref(null)
const error = ref('')
const configuredUrl = import.meta.env.VITE_GET_ALL_BOOKS_URL
const countUrl = import.meta.env.VITE_COUNT_BOOKS_URL
const endpoint = configuredUrl || countUrl?.replace(/countBooks(?:\?.*)?$/, 'getAllBooks')
const formattedJson = computed(() => JSON.stringify(jsonData.value, null, 2))

async function getAllBooks() {
  if (!endpoint) {
    error.value = 'The GetAllBookAPI endpoint has not been configured.'
    return
  }
  try {
    const response = await axios.get(endpoint, { timeout: 15000 })
    jsonData.value = response.data
  } catch {
    error.value = 'Unable to retrieve the books API response.'
  }
}

onMounted(getAllBooks)
</script>

<template>
  <div class="json-page">
    <pre v-if="jsonData">{{ formattedJson }}</pre>
    <pre v-else-if="error">{{ JSON.stringify({ error }, null, 2) }}</pre>
    <pre v-else>{{ JSON.stringify({ status: 'loading' }, null, 2) }}</pre>
  </div>
</template>

<style scoped>
.json-page {
  min-height: 100vh;
  padding: 2rem;
  background: #101827;
  color: #dbeafe;
}
pre {
  max-width: 1100px;
  margin: 0 auto;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font:
    15px/1.55 ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    monospace;
}
</style>
