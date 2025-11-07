<template>
    <nav class="navbar">

        <button><router-link to="/comp1" class="nav-link">Componente 1</router-link></button>
        <button><router-link to="/comp2" class="nav-link">Componente 2</router-link></button>
        <h1>Mi Aplicación de Música</h1>
    </nav>
</template>
<script setup lang="ts"></script>
<style scoped>
.navbar {
    background-color: #333;
    color: white;
    padding: 10px;
    text-align: center;
}   
</style>