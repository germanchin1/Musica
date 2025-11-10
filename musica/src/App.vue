<script setup lang="ts">
import Navbar from './components/navbar.vue'
import reproductor from './components/reproductor.vue';
</script>

<template>
  <div>
    <Navbar/>
    <reproductor/>


    <div class="viewer">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.controls {
  margin: 16px 0;
  display: flex;
  gap: 8px;
}

button {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}

.viewer {
  margin-top: 12px;
}
</style>
