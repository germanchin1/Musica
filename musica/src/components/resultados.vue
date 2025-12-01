<template>
  <div class="resultados">
    <div v-if="records.length">
      <div v-for="(item, i) in records" :key="item.id" class="registro">
        <span class="posicion">{{ i + 1 }}.</span>
        <div class="datos">
          <p class="jugador">{{ item.jugador }}</p>
          <p class="detalles">
            {{ item.aciertos }} aciertos
            <span class="fecha">{{ item.fecha }}</span>
          </p>
        </div>
      </div>
    </div>

    <p v-else class="sin-datos">Aún no hay resultados guardados.</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const records = ref([])

function cargar() {
  records.value = Object.keys(localStorage)
    .filter(k => k.startsWith('resultadoJuego_'))
    .map(k => {
      const d = JSON.parse(localStorage.getItem(k) || '{}')
      return {
        id: k,
        jugador: d.jugador,
        aciertos: Number(d.aciertos) || 0,
        fecha: d.fecha ? new Date(d.fecha).toLocaleDateString('es-ES') : ''
      }
    })
    .sort((a, b) => b.aciertos - a.aciertos)
    .slice(0, 10)
}

cargar()
</script>



<style scoped>
.resultados {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.registro {
  display: flex;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(15, 23, 42, 0.1);
  background: #fff;
}

.posicion {
  font-weight: 600;
  color: #0f172a;
}

.datos {
  flex: 1;
}

.jugador {
  margin: 0;
  font-weight: 600;
  color: #0f172a;
}

.detalles {
  margin: 2px 0 0;
  color: #475569;
  font-size: 0.9rem;
}

.fecha {
  margin-left: 6px;
  color: #94a3b8;
}

.sin-datos {
  margin: 0;
  color: #94a3b8;
}
</style>
