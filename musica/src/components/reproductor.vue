<template>
  <div class="reproductor">
    <div class="controls">
      <button @click="empezarMusica" aria-label="Reproducir">Play</button>
      <button @click="pararMusica" aria-label="Detener">Stop</button>
    </div>

    <div class="cover" aria-hidden="false">
      <img id="imagen_cancion" class="cover-bg" :src="imagenFondo">
      <img id="vinyl" class="vinyl" :src="imagenFondo" :class="{ spinning: reproduciendo }" alt="Vinilo girando">
    </div>

    <label for="Respuestas">
      <input type="radio" name="respuestas" id=""><label for="">A</label>
      <input type="radio" name="respuestas" id=""><label for="">A</label>
      <input type="radio" name="respuestas" id=""><label for="">A</label>
      <input type="radio" name="respuestas" id=""><label for="">A</label>
    </label>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Howl } from 'howler'

const info = ref([])
const nCancion = ref(0)
const imagenFondo = ref('')
const reproduciendo = ref(false)
let sound = null

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const cargar_json = async () => {
  const response = await fetch('/data.json')
  info.value = await response.json()
  if (info.value.length > 0) {
    imagenFondo.value = info.value[0]?.imagen || ''
  }
}

onMounted(cargar_json)

function empezarMusica() {
  const track = info.value[nCancion.value]
  if (!track) return

  const ruta = track.cancion
  if (sound) sound.stop()

  sound = new Howl({
    src: [ruta],
    autoplay: false,
    loop: false,
    onload: async function () {
      const duracion = sound?.duration?.() || 0
      if (!duracion) return

      let tiempoAleatorio = Math.random() * duracion
      console.log('Duracion:', duracion, 'Tiempo Aleatorio Inicial:', tiempoAleatorio)
      while (tiempoAleatorio > duracion - 5) {
        tiempoAleatorio = Math.random() * duracion
      }

      sound.seek?.(tiempoAleatorio)
      sound.play?.()
      reproduciendo.value = true
      await sleep(5000)
      sound.stop?.()
      reproduciendo.value = false
      console.log('Reproducción terminada en', tiempoAleatorio + 5) 
    },

  })

  imagenFondo.value = track.imagen || ''
}

function pararMusica() {
  if (!sound) return
  sound.pause()
  reproduciendo.value = false
}
</script>



<style scoped>
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
  border: 1px solid rgba(11,18,32,0.08);
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
  border: 1px solid rgba(11,18,32,0.08);
  background: #fff;
  color: #0b1220;
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
</style>
