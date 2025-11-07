<template>
  <div class="componente1">
    <h1>{{ titulo }}</h1>
    <p>{{ descripcion }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const titulo = ref('Componente 1')
const descripcion = ref('Este es el primer componente de la SPA')
</script>

<style scoped>
.componente1 {
  padding: 20px;
  background: #f5f7ff;
  border-radius: 8px;
}
</style>
