<script setup>
import { ref } from 'vue'
import { addDoc, collection } from 'firebase/firestore'
import db from '../firebase/init'
import BookList from '../components/BookList.vue'

const refreshKey = ref(0)
const isbn = ref('')
const name = ref('')
const busy = ref(false)
const error = ref('')
const success = ref('')

async function addBook() {
  if (busy.value) return
  error.value = ''
  success.value = ''
  const isbnNumber = Number(isbn.value)
  if (!String(isbn.value).trim() || !Number.isSafeInteger(isbnNumber) || isbnNumber < 0) {
    error.value = 'ISBN must be a valid non-negative whole number.'
    return
  }
  if (!name.value.trim()) {
    error.value = 'Please enter the book name.'
    return
  }
  if (!db) {
    error.value = 'Firebase is not configured.'
    return
  }
  busy.value = true
  try {
    const bookName = name.value.trim()
    const result = await addDoc(collection(db, 'books'), { isbn: isbnNumber, name: bookName })
    success.value = `Book added successfully: ${bookName} (ISBN: ${isbnNumber}). The Cloud Function will store its name in uppercase. Document ID: ${result.id}`
    refreshKey.value += 1
    isbn.value = ''
    name.value = ''
  } catch (err) {
    error.value = `Unable to add book (${err.code || 'unknown error'}). Check the Firestore database and its rules.`
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="card border-0 shadow-sm mx-auto mt-5" style="max-width: 760px">
    <div class="card-body p-4 p-md-5">
      <p class="text-primary fw-semibold">Library catalogue</p>
      <h1 class="h2">Add Book</h1>
      <p class="text-muted">Add a book to the library.</p>
      <form @submit.prevent="addBook">
        <div class="mb-3">
          <label for="isbn" class="form-label">ISBN</label>
          <input
            id="isbn"
            v-model="isbn"
            type="number"
            min="0"
            step="1"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label for="book-name" class="form-label">Name</label>
          <input id="book-name" v-model="name" class="form-control" required />
        </div>
        <p v-if="error" role="alert" class="alert alert-danger">{{ error }}</p>
        <p v-if="success" role="status" class="alert alert-success text-break">{{ success }}</p>
        <button class="btn btn-primary" :disabled="busy">
          {{ busy ? 'Adding…' : 'Add Book' }}
        </button>
      </form>
    </div>
  </section>
  <BookList :refresh-key="refreshKey" />
</template>
