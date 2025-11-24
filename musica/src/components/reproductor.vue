<template>
  <div class="reproductor">
    <div class="controls">
      <button @click="play">Play</button>
    </div>

    <div class="cover">
      <img class="cover-bg" :src="img" />
      <img class="vinyl" :src="img" :class="{ spinning: playing }" />
    </div>

    <div v-if="choices.length" class="radio-list" @change="check">
      <label v-for="(c, i) in choices" :key="i" class="radio-wrap">
        <input type="radio" name="r" :value="c" v-model="selected" />
        <span v-html="c"></span>
      </label>
    </div>

    <h1 class="contador">{{ score }} aciertos</h1>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Howl } from 'howler'

const data = ref([])          // todas las canciones
const round = ref([])         // 10 canciones seleccionadas
const index = ref(0)          // canción actual

const img = ref('')           // imagen vinilo
const playing = ref(false)    // animación

const choices = ref([])       // opciones de respuesta
const correct = ref('')       // respuesta correcta
const selected = ref('')      // opción seleccionada
const score = ref(0)          // aciertos
const numeroDeJuegos = ref(0)   // número de juegos jugados

let audio = null
const preguntasEchas = ref(0) // preguntas respondidas

const wait = ms => new Promise(r => setTimeout(r, ms))

onMounted(async () => {
  const res = await fetch('/data.json')
  data.value = await res.json()
  prepareRound()
})

// reproducir 5 segundos de la canción actual
function play() {
  const song = round.value[index.value]
  if (!song) return

  if (audio) audio.stop()

  audio = new Howl({
    src: [song.cancion],
    onload: async () => {
      const dur = audio.duration()
      const start = Math.random() * (dur - 5)

      audio.seek(start)
      audio.play()
      playing.value = true

      await wait(5000)

      audio.stop()
      playing.value = false
    }
  })

  img.value = song.imagen
}

// mezcla sencilla de arrays
const shuffle = arr => arr.sort(() => Math.random() - 0.5)

// preparar nueva ronda de 10 canciones
function prepareRound() {
  round.value = shuffle([...data.value]).slice(0, 10)
  index.value = 0
  preguntasEchas.value = 0
  score.value = 0
  prepareQuestion()
}

// preparar pregunta actual
function prepareQuestion() {
  const song = round.value[index.value]
  img.value = song.imagen

  const wrong = round.value
    .map(s => s.titulo)
    .filter(t => t !== song.titulo)

  choices.value = shuffle([song.titulo, ...wrong.slice(0, 3)])
  correct.value = song.titulo
  selected.value = ''
}

// verificar respuesta y pasar automáticamente a la siguiente
function check() {
  preguntasEchas.value++

  if (selected.value === correct.value) score.value++

  if (preguntasEchas.value >= 10) {
    alert(`Juego terminado\nAciertos: ${score.value}\nFallos: ${10 - score.value}`)
    numeroDeJuegos.value++
    guardarResultado()
  }

  index.value++
  prepareQuestion()
}

function guardarResultado() {
  localStorage.setItem(`resultadoJuego_${numeroDeJuegos.value}`, JSON.stringify({
    numeroDeJuegos: numeroDeJuegos.value,
    aciertos: score.value,
    fallos: 10 - score.value,
    fecha: new Date().toISOString()
  }))
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

button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
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

.radio-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}

.radio-wrap {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  border-radius: 12px;
  background: rgba(11,18,32,0.03);
  box-shadow: 0 2px 6px rgba(11,18,32,0.04);
  min-width: 130px;
  justify-content: center;
  cursor: pointer;
}

.radio-wrap:hover {
  background: rgba(11,18,32,0.06);
  transform: translateY(-2px);
}

.radio-wrap input[type="radio"] {
  accent-color: #0b1220;
  width: 18px;
  height: 18px;
}

.contador {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
