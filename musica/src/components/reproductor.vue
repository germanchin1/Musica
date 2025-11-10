<template>
  <div class="reproductor">
    <div class="controls">
      <button @click="previaCancion" aria-label="Anterior">Anterior</button>
      <button @click="empezarMusica" aria-label="Reproducir">Play</button>
      <button @click="pararMusica" aria-label="Detener">Stop</button>
      <button @click="siguienteCancion" aria-label="Siguiente">Siguiente</button>
    </div>

    <div class="cover" aria-hidden="false">
      <img id="imagen_cancion" class="cover-bg" :src="imagenFondo" alt="Carátula de la canción (fondo)">
      <img id="vinyl" class="vinyl" :src="imagenFondo" :class="{ spinning: reproduciendo }" alt="Vinilo girando">
    </div>

    <div class="sliders" role="group" aria-label="Controles del reproductor">
      <div class="slider">
        <label for="volume">Volumen</label>
        <input type="range" id="volume" min="0" max="1" step="0.01" v-model="vol" @input="cambiarVolumen">
      </div>

      <div class="slider">
        <label for="time">Tiempo</label>
        <input type="range" id="time" min="0" max="1" step="0.001" v-model="progreso" @input="cambiarTiempo">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Howl } from 'howler'

const info = ref<any[]>([])
const nCancion = ref(0)
let sound: Howl | null = null

const reproduciendo = ref(false)
const vol = ref(0.5)
const progreso = ref(0)
const imagenFondo = ref('')

// === Cargar canciones del JSON ===
const cargarCanciones = async () => {
  try {
    const response = await fetch('data.json')
    info.value = await response.json()
    console.log('Canciones cargadas:', info.value)
  } catch (error) {
    console.error('Error al cargar JSON:', error)
  }
}

onMounted(cargarCanciones)

// === Reproducir canción ===
const empezarMusica = () => {
  if (!info.value.length) {
    console.warn('Data JSON sin cargar')
    return
  }

  const ruta = info.value[nCancion.value].cancion
  const imagen = info.value[nCancion.value].imagen || ''

  if (sound) {
    sound.stop()
  }

  sound = new Howl({
    src: [ruta],
    autoplay: true,
    loop: false,
    volume: vol.value,
    onplay: () => (reproduciendo.value = true),
    onpause: () => (reproduciendo.value = false),
    onend: () => {
      reproduciendo.value = false
      siguienteCancion()
    },
    onseek: actualizarProgreso,
  })

  imagenFondo.value = imagen
}

// === Detener música ===
const pararMusica = () => {
  if (sound) {
    sound.pause()
    reproduciendo.value = false
  }
}

// === Canción siguiente/anterior ===
const siguienteCancion = () => {
  if (!info.value.length) return
  nCancion.value = (nCancion.value + 1) % info.value.length
  empezarMusica()
}

const previaCancion = () => {
  if (!info.value.length) return
  nCancion.value = (nCancion.value - 1 + info.value.length) % info.value.length
  empezarMusica()
}

// === Volumen ===
const cambiarVolumen = () => {
  if (sound) sound.volume(vol.value)
}

// === Tiempo ===
const cambiarTiempo = () => {
  if (sound) {
    const duracion = sound.duration()
    sound.seek(duracion * progreso.value)
  }
}

const actualizarProgreso = () => {
  if (sound && reproduciendo.value) {
    const duracion = sound.duration()
    const actual = sound.seek() as number
    progreso.value = duracion ? actual / duracion : 0
    requestAnimationFrame(actualizarProgreso)
  }
}

watch(reproduciendo, (nuevo) => {
  if (nuevo) actualizarProgreso()
})
</script>

<style scoped>
:root {
  --bg: #f6f8fb;
  --text: #0b1220;
  --border: rgba(11,18,32,0.08);
  --accent: #7c5cff;
}

.reproductor {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: 480px;
  max-width: calc(100% - 48px);
  display: grid;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(6px);
}

.controls {
  display: flex;
  gap: 8px;
  justify-content: center;
}

button {
  font-size: 14px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--text);
  font-weight: 600;
  cursor: pointer;
  transition: background 120ms ease, transform 100ms ease;
}

button:hover {
  background: #f3f4f6;
  transform: translateY(-1px);
}

.cover {
  position: relative;
  width: 240px;
  height: 240px;
  margin-inline: auto;
}

.cover-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  filter: blur(10px) brightness(0.45);
}

.vinyl {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  border: 6px solid rgba(0, 0, 0, 0.5);
  background: #000;
  transform-origin: 50% 50%;
  animation: spin 10s linear infinite;
  animation-play-state: paused;
}

.vinyl.spinning {
  animation-play-state: running;
}

@keyframes spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.sliders {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.slider {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.slider label {
  font-size: 12px;
  color: #6b7280;
}
</style>
