<script setup>
import axios from 'axios'
import { ref } from 'vue'

const count = ref(null)
const error = ref('')
const loading = ref(false)
const countBooksUrl = import.meta.env.VITE_COUNT_BOOKS_URL

async function getBookCount() {
  if (loading.value) return
  count.value = null
  error.value = ''
  if (!countBooksUrl) {
    error.value = 'The book counting service has not been configured yet.'
    return
  }
  loading.value = true
  try {
    const response = await axios.get(countBooksUrl, { timeout: 15000 })
    const total = response.data.count
    if (!Number.isSafeInteger(total) || total < 0) {
      throw new Error('Invalid book count')
    }
    count.value = total
  } catch {
    error.value = 'Error fetching book count. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <section class="card border-0 shadow-sm mx-auto mt-5" style="max-width: 760px">
    <div class="card-body p-4 p-md-5">
      <p class="text-primary fw-semibold">Library catalogue</p>
      <h1 class="h2">Book Counter</h1>
      <p class="text-muted">Get the total number of books in the library.</p>
      <button class="btn btn-primary" :disabled="loading" @click="getBookCount">
        {{ loading ? 'Counting…' : 'Get Book Count' }}
      </button>
      <p v-if="count !== null" class="alert alert-success mt-3" role="status">
        Total number of books: {{ count }}
      </p>
      <p v-if="error" class="alert alert-danger mt-3" role="alert">{{ error }}</p>
    </div>
  </section>
</template>
