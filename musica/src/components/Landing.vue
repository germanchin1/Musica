<template>
  <section class="landing">
    <div class="hero">
      <h1>Vinyl Guessr</h1>
      <p>Escucha un fragmento, adivina el título y entra al ranking.</p>
      <RouterLink to="/reproductor" class="primary">Jugar</RouterLink>
    </div>

    <section class="leaderboard">
      <h2>Top reciente</h2>
      <Resultados />
    </section>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import Resultados from './resultados.vue'
</script>

<style scoped>
.landing {
  width: min(640px, 100%);
  margin: 0 auto;
  padding: 32px 16px 64px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.hero {
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hero h1 {
  margin: 0;
  font-size: 2.4rem;
}

.hero p {
  margin: 0;
  color: #475569;
}

.primary {
  align-self: center;
  padding: 10px 24px;
  border-radius: 999px;
  background: #111827;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
}

.leaderboard {
  background: #fff;
  border: 1px solid rgba(15, 23, 42, 0.08);
  border-radius: 12px;
  padding: 16px;
}

.leaderboard h2 {
  margin: 0 0 10px;
}
</style>
