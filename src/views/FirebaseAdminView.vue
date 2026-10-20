<script setup>
import { firebaseUser } from '../stores/firebaseAuth'
</script>
<template>
  <section class="card border-0 shadow-sm mx-auto mt-5" style="max-width: 620px">
    <div class="card-body p-5">
      <h1 class="h2">Library administrator</h1>
      <p class="badge bg-primary">admin</p>
      <p>Welcome, {{ firebaseUser?.email }}.</p>
      <p>This lab page is available to administrator accounts only.</p>
      <RouterLink to="/FireLogout" class="btn btn-outline-danger">Log out</RouterLink>
    </div>
  </section>
</template>
