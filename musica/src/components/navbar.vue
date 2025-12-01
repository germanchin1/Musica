<template>
    <header class="navbar">
        <RouterLink to="/" class="brand">
            <span class="logo-dot" aria-hidden="true"></span>
            <span class="logo-text">Concurso Musical</span>
        </RouterLink>

        <nav class="links">
            <RouterLink to="/" class="nav-link" active-class="active">Inicio</RouterLink>
            <RouterLink to="/reproductor" class="nav-link" active-class="active">Jugar</RouterLink>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.navbar {
    position: sticky;
    top: 0;
    z-index: 10;
    backdrop-filter: blur(15px);
    background: rgba(255, 255, 255, 0.7);
    border-bottom: 1px solid rgba(15, 23, 42, 0.08);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px clamp(16px, 4vw, 48px);
}

.brand {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 700;
    text-decoration: none;
    color: #0b1220;
}

.logo-dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: linear-gradient(120deg, #2563eb, #ec4899);
    box-shadow: 0 0 12px rgba(37, 99, 235, 0.6);
}

.links {
    display: flex;
    gap: 20px;
}

.nav-link {
    text-decoration: none;
    color: #334155;
    font-weight: 600;
    position: relative;
    padding-bottom: 4px;
}

.nav-link::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(120deg, #2563eb, #ec4899);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 150ms ease;
}

.nav-link:hover::after,
.nav-link.active::after {
    transform: scaleX(1);
}

@media (max-width: 600px) {
    .links {
        gap: 12px;
    }
}
</style>