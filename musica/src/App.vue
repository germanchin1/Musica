<script setup lang="ts">
import Navbar from './components/navbar.vue'
</script>

<template>
  <div class="app-shell">
    <Navbar />
    <main class="page">
      <router-view />
    </main>
  </div>
</template>

<style>
:global(body) {
  margin: 0;
  font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
  background: radial-gradient(circle at top, #f0f4ff 0%, #e0ecff 40%, #fef6ff 100%);
  color: #0b1220;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page {
  flex: 1;
  padding: 24px clamp(16px, 4vw, 48px) 48px;
}
</style>
