<template>
  <div class="componente1">
    <h1>{{ titulo }}</h1>
    <p>{{ descripcion }}</p>
        <button><router-link to="/comp2" class="nav-link">Componente 2</router-link></button>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const titulo = ref('Componente 1')
const descripcion = ref('Hola soy el comoponente 1')
</script>

<style scoped>
.componente1 {
  padding: 20px;
  background: #f5f7ff;
  border-radius: 8px;
}
</style>
