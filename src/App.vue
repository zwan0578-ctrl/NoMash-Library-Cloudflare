<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import BHeader from './components/BHeader.vue'

const route = useRoute()
const showHeader = computed(() => !route.meta.apiView)
</script>

<template>
  <div class="main-container">
    <BHeader v-if="showHeader" />
    <main :class="showHeader ? 'main-box container py-4' : 'api-box'">
      <RouterView />
    </main>
  </div>
</template>

<style>
body {
  background: #f8fafc;
  color: #1f2937;
}
.main-container {
  min-height: 100vh;
}
.main-box {
  max-width: 1200px;
}
.api-box {
  min-height: 100vh;
}
h1 {
  letter-spacing: -0.02em;
}
</style>
