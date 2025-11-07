<template>
  <div class="componente2">
    <h1>{{ titulo }}</h1>
    <p>{{ descripcion }}</p>
    <button><router-link to="/comp1" class="nav-link">Componente 1</router-link></button>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const titulo = ref('Componente 2')
const descripcion = ref('¿Componente 2?')
</script>

<style scoped>
.componente2 {
  padding: 20px;
  background: #fff7f0;
  border-radius: 8px;
}
</style>
