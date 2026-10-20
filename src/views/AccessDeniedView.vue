<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>
<template>
  <section class="text-center py-5">
    <h1>Access denied</h1>
    <p class="text-muted">
      {{
        route.query.reason === 'admin'
          ? 'This page requires an administrator account.'
          : 'You need to log in to access this members-only page.'
      }}
    </p>
    <RouterLink
      class="btn btn-primary"
      :to="route.query.reason === 'admin' ? '/FireLogin' : '/login'"
      >Go to login</RouterLink
    >
  </section>
</template>
