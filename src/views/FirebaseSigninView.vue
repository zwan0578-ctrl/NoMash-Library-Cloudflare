<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { firebaseAuth, firebaseConfigured } from '../firebase'
import {
  firebaseUser,
  firebaseRole,
  firebaseSessionError,
  syncFirebaseUser,
  currentUserSummary,
  authErrorMessage
} from '../stores/firebaseAuth'

const email = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)
const route = useRoute()
const signin = async () => {
  if (busy.value || !firebaseConfigured) return
  busy.value = true
  error.value = ''
  try {
    const { user } = await signInWithEmailAndPassword(
      firebaseAuth,
      email.value.trim(),
      password.value
    )
    await syncFirebaseUser(user)
    password.value = ''
    console.log('Firebase sign in successful!')
    // Log identity fields for the lab screenshot without exposing session tokens.
    console.log('Current user:', currentUserSummary())
  } catch (err) {
    error.value = authErrorMessage(err)
    console.error('Firebase sign in:', err.code)
  } finally {
    busy.value = false
  }
}
</script>

<template>
  <section class="card border-0 shadow-sm mx-auto mt-5" style="max-width: 620px">
    <div class="card-body p-4 p-md-5">
      <p class="text-primary fw-semibold">Firebase Authentication</p>
      <h1 class="h2">Sign in</h1>
      <p v-if="!firebaseConfigured" class="alert alert-warning">
        Firebase setup is pending. Add your web app configuration to .env.local and restart the
        development server.
      </p>
      <p v-if="route.query.registered && !firebaseUser" class="alert alert-success">
        Account created. Please sign in below.
      </p>
      <p v-if="firebaseSessionError" class="alert alert-danger">{{ firebaseSessionError }}</p>
      <div v-if="firebaseUser" class="mt-4">
        <p class="alert alert-success">You are signed in.</p>
        <dl>
          <dt>Email</dt>
          <dd>{{ firebaseUser.email }}</dd>
          <dt>User ID</dt>
          <dd class="text-break">{{ firebaseUser.uid }}</dd>
          <dt>Role</dt>
          <dd>
            <span class="badge bg-primary">{{ firebaseRole || 'Loading…' }}</span>
          </dd>
        </dl>
        <p>
          {{
            firebaseRole === 'admin'
              ? 'Administrator access: open the admin area.'
              : 'Member access: explore the library.'
          }}
        </p>
        <RouterLink v-if="firebaseRole === 'admin'" class="btn btn-primary me-2" to="/FireAdmin"
          >Admin area</RouterLink
        >
        <RouterLink class="btn btn-outline-danger" to="/FireLogout">Log out</RouterLink>
      </div>
      <form v-else @submit.prevent="signin">
        <div class="mb-3">
          <label for="firebase-email" class="form-label">Email</label
          ><input
            id="firebase-email"
            v-model="email"
            type="email"
            autocomplete="username"
            class="form-control"
            required
          />
        </div>
        <div class="mb-3">
          <label for="firebase-password" class="form-label">Password</label
          ><input
            id="firebase-password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            class="form-control"
            required
          />
        </div>
        <p v-if="error" role="alert" class="alert alert-danger">{{ error }}</p>
        <button class="btn btn-primary w-100" :disabled="busy || !firebaseConfigured">
          {{ busy ? 'Signing in…' : 'Sign in via Firebase' }}
        </button>
        <p class="mt-3 mb-0">
          New member? <RouterLink to="/FireRegister">Create an account</RouterLink>
        </p>
      </form>
    </div>
  </section>
</template>
