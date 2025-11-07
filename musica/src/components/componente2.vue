<template>
  <div class="componente2">
    <h1>{{ titulo }}</h1>
    <p>{{ descripcion }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const titulo = ref('Componente 2')
const descripcion = ref('Este es el segundo componente — alterna con el primero')
</script>

<style scoped>
.componente2 {
  padding: 20px;
  background: #fff7f0;
  border-radius: 8px;
}
</style>
