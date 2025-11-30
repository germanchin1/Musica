<template>
  <section class="resultados" v-if="records.length">
    <h2 v-if="showTitle">Top 10 partidas</h2>
    <ol>
      <li v-for="(item, idx) in records" :key="item.id || idx">
        <span class="jugador">{{ item.jugador || 'Anónimo' }}</span>
        <span class="datos">
          <strong>{{ item.aciertos }}</strong> aciertos
          <span class="fecha">· {{ formatDate(item.fecha) }}</span>
        </span>
      </li>
    </ol>
  </section>
  <section class="resultados" v-else>
    <h2 v-if="showTitle">Top 10 partidas</h2>
    <p class="sin-datos">Aún no hay resultados guardados.</p>
  </section>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'

const props = defineProps({
  refreshToken: {
    type: Number,
    default: 0
  },
  showTitle: {
    type: Boolean,
    default: true
  }
})

const records = ref([])
let storageHandler = null

function loadResults() {
  if (typeof window === 'undefined') return

  const keys = Object.keys(localStorage).filter((k) => k.startsWith('resultadoJuego_'))
  const parsed = keys
    .map((key) => {
      try {
        const raw = localStorage.getItem(key)
        if (!raw) return null
        const data = JSON.parse(raw)
        return {
          id: key,
          jugador: data?.jugador || 'Anónimo',
          aciertos: Number(data?.aciertos) || 0,
          fecha: data?.fecha || new Date().toISOString(),
        }
      } catch (error) {
        return null
      }
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (b.aciertos !== a.aciertos) return b.aciertos - a.aciertos
      return new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
    })
    .slice(0, 10)

  records.value = parsed
}

function formatDate(value) {
  if (!value) return 'Fecha desconocida'
  const date = new Date(value)
  return isNaN(date.getTime())
    ? 'Fecha desconocida'
    : new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date)
}

onMounted(() => {
  loadResults()
  storageHandler = () => loadResults()
  window.addEventListener('storage', storageHandler)
})

onUnmounted(() => {
  if (storageHandler) {
    window.removeEventListener('storage', storageHandler)
  }
})

watch(() => props.refreshToken, loadResults)
</script>

<style scoped>
.resultados {
  width: 100%;
  margin-top: 16px;
  padding: 16px;
  border: 1px solid rgba(11, 18, 32, 0.1);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.resultados h2 {
  margin: 0 0 12px;
  font-size: 1.2rem;
}

.resultados ol {
  margin: 0;
  padding-left: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resultados li {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.jugador {
  font-weight: 600;
  color: #0b1220;
}

.datos {
  font-size: 0.9rem;
  color: #4b5563;
}

.datos strong {
  color: #0b1220;
}

.fecha {
  margin-left: 4px;
}

.sin-datos {
  margin: 0;
  color: #6b7280;
}
</style>
