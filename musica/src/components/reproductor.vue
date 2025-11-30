<template>
  <div class="reproductor" v-if="!showResults" :class="{ bloqueado: !gameReady }">

    <!-- Nombre del jugador -->
    <div class="player-setup">
      <label for="nombre">Escribe tu nombre</label>
      <input
        id="nombre"
        type="text"
        v-model="playerInput"
        :disabled="nameLocked"
        placeholder="Tu nombre"
      />
      <button class="guardar-nombre" @click="lockName" :disabled="nameLocked">Guardar</button>
    </div>

    <!-- Botón Play -->
    <div class="controls">
      <button class="primary" @click="play" :disabled="!gameReady">Play</button>
    </div>

    <!-- Imagen -->
    <div class="cover">
      <img class="cover-bg" :src="img" />
      <img class="vinyl" :src="img" :class="{ spinning: playing }" />
    </div>

    <!-- Opciones -->
    <div v-if="choices.length" class="radio-list" @change="check">
      <label
        v-for="(c, i) in choices"
        :key="i"
        class="radio-wrap"
      >
        <input
          type="radio"
          name="r"
          :value="c"
          v-model="selected"
          :disabled="!gameReady"
        />
        <span v-html="c"></span>
      </label>
    </div>

    <h1 class="contador">{{ score }} aciertos</h1>
  </div>

  <div v-else class="post-game">
    <Resultados class="resultados-panel" :refresh-token="resultsRefresh" />
    <button class="reiniciar" @click="nuevaPartida">Jugar otra vez</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { Howl } from "howler"
import Resultados from "./resultados.vue"

const data = ref([])
const round = ref([])
const index = ref(0)

const img = ref("")
const playing = ref(false)

const choices = ref([])
const correct = ref("")
const selected = ref("")
const score = ref(0)

const playerInput = ref("")
const playerName = ref("")
const nameLocked = ref(false)
const gameReady = ref(false)
const showResults = ref(false)
const resultsRefresh = ref(0)

// Número de partidas guardadas en localStorage
const numeroDeJuegos = ref(
  Object.keys(localStorage).filter(k => k.startsWith("resultadoJuego_")).length
)

let audio = null
const wait = ms => new Promise(r => setTimeout(r, ms))

// Cargar datos de canciones
onMounted(async () => {
  const res = await fetch("/data.json")
  data.value = await res.json()

  const storedName = localStorage.getItem("nombreJugador")
  if (storedName) {
    playerInput.value = storedName
  }

  // Al inicio: todo deshabilitado excepto nombre
  resetToInitialState()
})

// Reproducir
function play() {
  if (!gameReady.value) return

  const song = round.value[index.value]
  if (!song) return

  stopAudio()

  audio = new Howl({
    src: [song.cancion],
    onload: async () => {
      const dur = audio.duration()
      const start = Math.random() * (dur - 5)
      audio.seek(start)
      audio.play()
      playing.value = true

      await wait(10000)
      stopAudio()
    }
  })

  img.value = song.imagen
}

// Barajar
const shuffle = arr => arr.sort(() => Math.random() - 0.5)

// Crear ronda de 10 canciones
function prepareRound() {
  round.value = shuffle([...data.value]).slice(0, 10)
  index.value = 0
  score.value = 0
  prepareQuestion()
}

// Crear pregunta
function prepareQuestion() {
  const song = round.value[index.value]
  if (!song) {
    choices.value = []
    return
  }
  img.value = song.imagen

  const wrong = round.value
    .map(s => s.titulo)
    .filter(t => t !== song.titulo)

  choices.value = shuffle([song.titulo, ...wrong.slice(0, 3)])
  correct.value = song.titulo
  selected.value = ""
}

// Comprobar selección
function check() {
  if (!gameReady.value) return

  stopAudio()

  if (selected.value === correct.value) score.value++

  index.value++

  if (index.value >= round.value.length) {
    finalizarJuego()
    return
  }

  prepareQuestion()
  play()
}

// Finalizar ronda → volver al estado inicial
function finalizarJuego() {
  const totalPreguntas = round.value.length || 0
  const fallos = Math.max(totalPreguntas - score.value, 0)
  alert(`Juego terminado\nAciertos: ${score.value}\nFallos: ${fallos}`)

  numeroDeJuegos.value++
  guardarResultado(totalPreguntas, fallos)

  showResults.value = true
  resultsRefresh.value += 1

  resetToInitialState()
}

// Guardar resultado en localStorage
function guardarResultado(totalPreguntas, fallos) {
  localStorage.setItem(
    `resultadoJuego_${numeroDeJuegos.value}`,
    JSON.stringify({
      numeroDeJuego: numeroDeJuegos.value,
      aciertos: score.value,
      fallos: typeof fallos === "number" ? fallos : Math.max(totalPreguntas - score.value, 0),
      fecha: new Date().toISOString(),
      jugador: playerName.value
    })
  )
}

// Estado inicial después de terminar
function resetToInitialState() {
  stopAudio()
  gameReady.value = false
  nameLocked.value = false
  playerName.value = ""
  // Mantenemos el último nombre escrito para facilitar repetir partidas
  if (!playerInput.value) {
    const storedName = localStorage.getItem("nombreJugador")
    playerInput.value = storedName || ""
  }

  choices.value = []
  selected.value = ""
  img.value = ""
  index.value = 0
  score.value = 0
}

// Guardar nombre y arrancar juego
function lockName() {
  const nombre = playerInput.value.trim()
  if (!nombre) return

  playerName.value = nombre
  nameLocked.value = true
  gameReady.value = true
  showResults.value = false
  localStorage.setItem("nombreJugador", nombre)

  prepareRound()
}

// Parar audio
function stopAudio() {
  if (audio) {
    audio.stop()
    playing.value = false
  }
}

function nuevaPartida() {
  showResults.value = false
  resetToInitialState()
}
</script>






<style scoped>
.reproductor {
  width: min(960px, 100%);
  margin: 24px auto 80px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-radius: 30px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(255, 255, 255, 0.92);
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.15);
}

.reproductor.bloqueado {
  opacity: 0.8;
}

.player-setup {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: flex-end;
}

.player-setup label {
  font-weight: 600;
  color: #475569;
  flex-basis: 100%;
}

.player-setup input {
  flex: 1;
  padding: 12px 16px;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.15);
  font-size: 1rem;
  background: rgba(248, 250, 252, 0.9);
}

.guardar-nombre,
.primary,
.reiniciar {
  padding: 12px 20px;
  border-radius: 999px;
  border: 1px solid rgba(15, 23, 42, 0.12);
  background: #fff;
  color: #0b1220;
  font-weight: 600;
  cursor: pointer;
  transition: transform 120ms ease, box-shadow 120ms ease, background 120ms ease;
}

.guardar-nombre:hover:not(:disabled),
.primary:hover:not(:disabled),
.reiniciar:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.12);
}

.primary {
  background: linear-gradient(120deg, #2563eb, #ec4899);
  color: #fff;
  border: none;
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  box-shadow: none;
}

.controls {
  display: flex;
  justify-content: center;
}

.cover {
  width: 320px;
  height: 320px;
  margin: 0 auto;
  position: relative;
}

.cover-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 24px;
  filter: blur(16px) brightness(0.4);
}

.vinyl {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 260px;
  height: 260px;
  border-radius: 50%;
  border: 12px solid rgba(15, 23, 42, 0.6);
  object-fit: cover;
  animation: spin 12s linear infinite;
  animation-play-state: paused;
}

.vinyl.spinning {
  animation-play-state: running;
}

@keyframes spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

.radio-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  width: 100%;
}

.radio-wrap {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 14px 16px;
  border-radius: 18px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  background: rgba(248, 250, 252, 0.9);
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.08);
}

.radio-wrap input[type="radio"] {
  accent-color: #2563eb;
  width: 20px;
  height: 20px;
}

.contador {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  color: #111827;
}

.post-game {
  width: min(720px, 100%);
  margin: 40px auto 80px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.resultados-panel {
  width: 100%;
}

.reiniciar {
  align-self: center;
}

@media (max-width: 640px) {
  .reproductor {
    padding: 24px;
  }
  .cover {
    width: 240px;
    height: 240px;
  }
  .vinyl {
    width: 200px;
    height: 200px;
  }
}
</style>
