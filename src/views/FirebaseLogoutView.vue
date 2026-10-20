<script setup>
import { ref } from 'vue'
import { firebaseUser, logoutFirebase, authErrorMessage } from '../stores/firebaseAuth'
const error = ref('')
const busy = ref(false)
const logout = async () => {
  busy.value = true
  error.value = ''
  try {
    await logoutFirebase()
  } catch (err) {
    error.value = authErrorMessage(err)
  } finally {
    busy.value = false
  }
}
</script>
<template>
  <section class="card border-0 shadow-sm mx-auto mt-5" style="max-width: 560px">
    <div class="card-body p-5">
      <h1 class="h2">Firebase logout</h1>
      <template v-if="firebaseUser"
        ><p>Signed in as {{ firebaseUser.email }}</p>
        <button class="btn btn-danger" :disabled="busy" @click="logout">
          {{ busy ? 'Signing out…' : 'Log out of Firebase' }}
        </button></template
      >
      <template v-else
        ><p class="alert alert-success">You are signed out.</p>
        <p>Current user: <code>null</code></p>
        <RouterLink to="/FireLogin" class="btn btn-primary">Sign in again</RouterLink></template
      >
      <p v-if="error" role="alert" class="alert alert-danger mt-3">{{ error }}</p>
    </div>
  </section>
</template>
