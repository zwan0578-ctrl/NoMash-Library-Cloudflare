<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { firebaseAuth, firebaseConfigured } from '../firebase'
import { authErrorMessage } from '../stores/firebaseAuth'

const email = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)
const router = useRouter()
const register = async () => {
  if (busy.value || !firebaseConfigured) return
  busy.value = true
  error.value = ''
  try {
    await createUserWithEmailAndPassword(firebaseAuth, email.value.trim(), password.value)
    console.log('Firebase register successful!')
    // Firebase signs new users in automatically; sign out for the lab's separate login step.
    await signOut(firebaseAuth)
    password.value = ''
    await router.push({ name: 'FireLogin', query: { registered: '1' } })
  } catch (err) {
    error.value = authErrorMessage(err)
    console.error('Firebase registration:', err.code)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="card border-0 shadow-sm mx-auto mt-5" style="max-width: 560px">
    <div class="card-body p-4 p-md-5">
      <p class="text-primary fw-semibold">Firebase Authentication</p>
      <h1 class="h2">Create an Account</h1>
      <p class="text-muted">Register for a library member account.</p>
      <p v-if="!firebaseConfigured" class="alert alert-warning">
        Firebase setup is pending. Add your web app configuration to .env.local and restart the
        development server.
      </p>
      <form @submit.prevent="register">
        <div class="mb-3">
          <label for="register-email" class="form-label">Email</label
          ><input
            id="register-email"
            v-model="email"
            type="email"
            autocomplete="email"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label for="register-password" class="form-label">Password</label
          ><input
            id="register-password"
            v-model="password"
            type="password"
            minlength="6"
            autocomplete="new-password"
            class="form-control"
            required
          /><small class="text-muted">At least 6 characters.</small>
        </div>
        <p v-if="error" role="alert" class="alert alert-danger">{{ error }}</p>
        <button class="btn btn-primary w-100" :disabled="busy || !firebaseConfigured">
          {{ busy ? 'Creating account…' : 'Save to Firebase' }}
        </button>
      </form>
      <p class="mt-3 mb-0">Already registered? <RouterLink to="/FireLogin">Sign in</RouterLink></p>
    </div>
  </section>
</template>
