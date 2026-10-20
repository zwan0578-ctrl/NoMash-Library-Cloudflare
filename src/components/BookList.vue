<script setup>
import { computed, ref, watch } from 'vue'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore'
import db from '../firebase/init'
import { firebaseUser } from '../stores/firebaseAuth'

const props = defineProps({ refreshKey: { type: Number, default: 0 } })
const books = ref([])
const direction = ref('asc')
const maxResults = ref(10)
const loading = ref(false)
const saving = ref(false)
const error = ref('')
const message = ref('')
const editingId = ref(null)
const editName = ref('')
const editIsbn = ref('')
const deleting = ref(null)
let requestId = 0
const queryDescription = computed(
  () =>
    `ISBN > 1000 · ISBN ${direction.value === 'asc' ? 'ascending' : 'descending'} · First ${maxResults.value} books`
)

async function fetchBooks() {
  const currentRequest = ++requestId
  books.value = []
  error.value = ''
  loading.value = false
  if (!firebaseUser.value || !db) return
  loading.value = true
  try {
    const booksQuery = query(
      collection(db, 'books'),
      where('isbn', '>', 1000),
      orderBy('isbn', direction.value),
      limit(Number(maxResults.value))
    )
    const snapshot = await getDocs(booksQuery)
    if (currentRequest === requestId) {
      books.value = snapshot.docs.map((item) => ({ ...item.data(), id: item.id }))
    }
  } catch (err) {
    if (currentRequest === requestId)
      error.value = `Unable to load books (${err.code || 'unknown error'}).`
  } finally {
    if (currentRequest === requestId) loading.value = false
  }
}

function startEdit(book) {
  editingId.value = book.id
  editName.value = book.name
  editIsbn.value = book.isbn
  deleting.value = null
  message.value = ''
  error.value = ''
}

function confirmDelete(book) {
  deleting.value = book
  editingId.value = null
  message.value = ''
}

async function saveBook() {
  if (saving.value) return
  const isbn = Number(editIsbn.value)
  const name = editName.value.trim()
  if (!name || !String(editIsbn.value).trim() || !Number.isSafeInteger(isbn) || isbn < 0) {
    error.value = 'Enter a book name and a non-negative whole-number ISBN.'
    return
  }
  saving.value = true
  error.value = ''
  message.value = ''
  try {
    await updateDoc(doc(db, 'books', editingId.value), { isbn, name })
    editingId.value = null
    message.value = `Book updated successfully: ${name} (ISBN: ${isbn}).`
    await fetchBooks()
  } catch (err) {
    error.value = `Unable to update book (${err.code || 'unknown error'}).`
  } finally {
    saving.value = false
  }
}

async function removeBook() {
  if (saving.value || !deleting.value) return
  const book = deleting.value
  saving.value = true
  error.value = ''
  message.value = ''
  try {
    await deleteDoc(doc(db, 'books', book.id))
    deleting.value = null
    message.value = `Book deleted successfully: ${book.name} (ISBN: ${book.isbn}).`
    await fetchBooks()
  } catch (err) {
    error.value = `Unable to delete book (${err.code || 'unknown error'}).`
  } finally {
    saving.value = false
  }
}

watch(
  [firebaseUser, () => props.refreshKey, direction, maxResults],
  () => {
    editingId.value = null
    deleting.value = null
    fetchBooks()
  },
  { immediate: true }
)
</script>

<template>
  <section class="card border-0 shadow-sm mx-auto my-4" style="max-width: 760px">
    <div class="card-body p-4 p-md-5">
      <h2 class="h3">Books with ISBN &gt; 1000</h2>
      <p v-if="!firebaseUser" class="alert alert-info">
        Please use Firebase Login to view and manage books.
      </p>
      <template v-else>
        <div class="row g-3 align-items-end mb-3">
          <div class="col-sm-5">
            <label for="book-sort" class="form-label">Sort by ISBN</label>
            <select id="book-sort" v-model="direction" class="form-select" :disabled="saving">
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <div class="col-sm-4">
            <label for="book-limit" class="form-label">Maximum results</label>
            <select
              id="book-limit"
              v-model.number="maxResults"
              class="form-select"
              :disabled="saving"
            >
              <option :value="2">2</option>
              <option :value="5">5</option>
              <option :value="10">10</option>
            </select>
          </div>
          <div class="col-sm-3">
            <button
              class="btn btn-outline-primary"
              :disabled="loading || saving"
              @click="fetchBooks"
            >
              Refresh
            </button>
          </div>
        </div>
        <p class="text-muted">{{ queryDescription }}</p>
        <p v-if="message" class="alert alert-success" role="status">{{ message }}</p>
        <p v-if="error" class="alert alert-danger" role="alert">{{ error }}</p>
        <p v-if="loading" role="status">Loading books…</p>
        <p v-else-if="!error && !books.length">No books match this query.</p>
        <div v-else-if="books.length" class="table-responsive">
          <table class="table align-middle">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">ISBN</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="book in books" :key="book.id">
                <td>{{ book.name }}</td>
                <td>{{ book.isbn }}</td>
                <td>
                  <div class="d-flex gap-2">
                    <button
                      class="btn btn-sm btn-outline-primary"
                      :disabled="saving || loading"
                      @click="startEdit(book)"
                    >
                      Edit
                    </button>
                    <button
                      class="btn btn-sm btn-outline-danger"
                      :disabled="saving || loading"
                      @click="confirmDelete(book)"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <form v-if="editingId" class="border rounded p-3 mt-3" @submit.prevent="saveBook">
          <h3 class="h5">Edit book</h3>
          <label for="edit-name" class="form-label">Name</label>
          <input
            id="edit-name"
            v-model="editName"
            class="form-control mb-3"
            required
            :disabled="saving"
          />
          <label for="edit-isbn" class="form-label">ISBN</label>
          <input
            id="edit-isbn"
            v-model="editIsbn"
            type="number"
            min="0"
            step="1"
            class="form-control mb-3"
            required
            :disabled="saving"
          />
          <button class="btn btn-primary me-2" :disabled="saving">
            {{ saving ? 'Saving…' : 'Save changes' }}
          </button>
          <button
            type="button"
            class="btn btn-outline-secondary"
            :disabled="saving"
            @click="editingId = null"
          >
            Cancel
          </button>
        </form>
        <div v-if="deleting" class="alert alert-warning mt-3">
          <p>Delete “{{ deleting.name }}” (ISBN: {{ deleting.isbn }})? This cannot be undone.</p>
          <button class="btn btn-danger me-2" :disabled="saving" @click="removeBook">
            {{ saving ? 'Deleting…' : 'Confirm delete' }}
          </button>
          <button class="btn btn-outline-secondary" :disabled="saving" @click="deleting = null">
            Cancel
          </button>
        </div>
      </template>
    </div>
  </section>
</template>
