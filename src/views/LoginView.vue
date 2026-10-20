<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { login } from '../stores/auth'

const username = ref('')
const password = ref('')
const error = ref('')
const route = useRoute()
const router = useRouter()

const handleSubmit = () => {
  if (login(username.value, password.value)) router.push(route.query.redirect || '/about')
  else error.value = 'Incorrect username or password.'
}
</script>

<template>
  <section class="card border-0 shadow-sm mx-auto mt-5" style="max-width: 520px">
    <div class="card-body p-5">
      <h1 class="h2 mb-2">Member login</h1>
      <p v-if="route.query.denied" class="alert alert-warning">Please log in before opening the protected About page.</p>
      <p class="text-muted">Demo credentials: <strong>student</strong> / <strong>library123</strong></p>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3"><label for="login-username" class="form-label">Username</label><input id="login-username" v-model="username" class="form-control" autocomplete="username" /></div>
        <div class="mb-3"><label for="login-password" class="form-label">Password</label><input id="login-password" v-model="password" type="password" class="form-control" autocomplete="current-password" /></div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <button class="btn btn-primary w-100" type="submit">Login</button>
      </form>
    </div>
  </section>
</template>
