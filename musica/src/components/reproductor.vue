<template>
  <div class="reproductor">
    <div class="controls">
      <button @click="empezarMusica" aria-label="Reproducir">Play</button>
      <button @click="siguientePregunta" aria-label="Siguiente Pregunta">Siguiente</button>
    </div>

    <div class="cover" aria-hidden="false">
      <img id="imagen_cancion" class="cover-bg" :src="imagenFondo">
      <img id="vinyl" class="vinyl" :src="imagenFondo" :class="{ spinning: reproduciendo }" alt="Vinilo girando">
    </div>

    <div
      v-if="opcionesPregunta.length"
      class="radio-list"
      role="radiogroup"
      aria-label="Respuestas"
      @change="verificarRespuesta"
    >
      <div
        v-for="(opcion, index) in opcionesPregunta"
        :key="`${opcion}-${index}`"
        class="radio-wrap"
      >
        <label class="radio-item">
          <input
            type="radio"
            name="radio"
            :value="opcion"
            v-model="respuestaSeleccionada"
            :aria-label="`Opción ${index + 1}`"
          />
          <span v-html="opcion"></span>
        </label>
      </div>
    </div>

    <h1 class="contador" v-html="contadorTexto"></h1>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Howl } from 'howler'

const PISTAS_POR_RONDA = 4
const OPCIONES_POR_PREGUNTA = 4

const info = ref([])
const pistasRonda = ref([])
const nCancion = ref(0)
const imagenFondo = ref('')
const reproduciendo = ref(false)
const opcionesPregunta = ref([])
const respuestaCorrecta = ref('')
const respuestaSeleccionada = ref('')
const aciertos = ref(0)
const contadorTexto = ref('0 aciertos')
let sound = null

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const cargar_json = async () => {
  const response = await fetch('/data.json')
  info.value = await response.json()
  if (info.value.length > 0) {
    prepararRonda()
  }
}

onMounted(cargar_json)

function empezarMusica() {
  if (!pistasRonda.value.length) prepararRonda()

  const track = pistasRonda.value[nCancion.value]
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



function prepararRonda() {
  if (!info.value.length) return

  const barajadas = mezclar([...info.value])
  const limite = Math.min(PISTAS_POR_RONDA, barajadas.length)
  pistasRonda.value = barajadas.splice(0, limite)
  nCancion.value = 0
  crearPreguntas()
}

function mezclar(array) {
  return array
    .map((valor) => ({ valor, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ valor }) => valor)
}

function crearPreguntas() {
  if (!pistasRonda.value.length) return

  const pistaActual = pistasRonda.value[nCancion.value] || pistasRonda.value[0]
  if (!pistaActual) return

  imagenFondo.value = pistaActual.imagen || ''

  const titulosDisponibles = pistasRonda.value.map(cancion => cancion.titulo)
  const distractores = titulosDisponibles.filter(titulo => titulo !== pistaActual.titulo)

  const opciones = [pistaActual.titulo]
  while (opciones.length < OPCIONES_POR_PREGUNTA && distractores.length) {
    const indice = Math.floor(Math.random() * distractores.length)
    opciones.push(distractores.splice(indice, 1)[0])
  }

  if (opciones.length < OPCIONES_POR_PREGUNTA) {
    const relleno = info.value
      .map(cancion => cancion.titulo)
      .filter(titulo => !opciones.includes(titulo))
    while (opciones.length < OPCIONES_POR_PREGUNTA && relleno.length) {
      opciones.push(relleno.shift())
    }
  }

  opcionesPregunta.value = mezclar(opciones)
  respuestaCorrecta.value = pistaActual.titulo
  respuestaSeleccionada.value = ''
}

function siguientePregunta() {
  if (!pistasRonda.value.length) return

  if (sound) {
    sound.stop()
    reproduciendo.value = false
  }

  const siguienteIndice = nCancion.value + 1
  if (siguienteIndice >= pistasRonda.value.length) {
    prepararRonda()
    return
  }

  nCancion.value = siguienteIndice
  crearPreguntas()
}

function verificarRespuesta(event) {
  const valor = event?.target?.value || respuestaSeleccionada.value
  if (valor === respuestaCorrecta.value) {
    aciertos.value += 1
    contadorTexto.value = `${aciertos.value} aciertos`
    siguientePregunta()
  }
}

</script>



<style scoped>
.reproductor {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: 980px;
  max-width: calc(100% - 48px);
  display: grid;
  gap: 12px;
  padding: 12px;
  border: 1px solid rgba(11,18,32,0.08);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(6px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  justify-items: center;
  align-items: center;

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

label {
  cursor: pointer;
  display: inline-block;
  width: 20%;
}

/* Radios en columna (específico para este componente) */
.radio-list {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
}
.radio-list label {
  float: none;
  display: flex;
  gap: 8px;
  align-items: center;
  width: auto;
}

.radio-wrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 12px;
  background: rgba(11,18,32,0.03);
  box-shadow: 0 2px 6px rgba(11,18,32,0.04);
  transition: background 120ms ease, transform 120ms ease;
  min-width: 130px;
  justify-content: center;
}
.radio-wrap:hover {
  background: rgba(11,18,32,0.06);
  transform: translateY(-2px);
}
.radio-item {
  font-weight: 700;
  color: #0b1220;
}
.radio-item input[type="radio"] {
  accent-color: #0b1220;
  width: 18px;
  height: 18px;
}


</style>
