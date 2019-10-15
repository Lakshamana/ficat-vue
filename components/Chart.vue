<template>
  <div>
    <div v-show="searchId > 0">
      <canvas id="canvas" ref="canvas"></canvas>
      <br />
      <div class="level">
        <div class="level-left"></div>
        <div class="level-right">
          <b-button
            class="btn-margin"
            icon-right="download"
            @click="downloadImage"
          />
          <b-button
            class="btn-margin"
            icon-right="file-pdf"
            @click="submitData"
          />
        </div>
      </div>
    </div>
    <div v-show="!searchId" style="text-align:center;">
      <p>Use os controles ao lado para pesquisar</p>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js'
import { rand } from '@/shared/frontUtils'

const labels = {
  monthly: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro'
  ],
  semiannually: ['1º semestre', '2º semestre'],
  annually: ''
}

function randColors(length) {
  const alpha = rand(50, 100) / 100
  return Array.from(
    { length },
    () => `rgba(${rand(0, 85)}, ${rand(85, 170)}, ${rand(170, 255)}, ${alpha})`
  )
}

export default {
  name: 'Chart',
  props: {
    searchType: {
      type: String,
      default: ''
    },

    searchId: {
      type: Number,
      default: 0
    },

    dataset: {
      type: Object,
      default: () => ({})
    }
  },

  data() {
    return {
      chart: undefined
    }
  },

  computed: {
    getLabels() {
      return labels[this.searchType]
    },

    ctx() {
      return this.$refs && this.$refs.canvas
    }
  },

  mounted() {
    this.chart = this.createChart(this.dataset)
  },

  methods: {
    createChart(dataset) {
      const length = Object.keys(dataset).length
      return new Chart(this.ctx, {
        type: 'bar',
        data: {
          labels: this.getLabels,
          datasets: [
            {
              label: 'Nº de fichas registradas',
              data: Object.values(dataset),
              backgroundColor: randColors(length),
              borderColor: randColors(length),
              borderWidth: 1
            }
          ]
        },
        options: {
          hover: { mode: null },
          tooltips: { enabled: true }
        }
      })
    },

    downloadImage() {
      // const ctx = this.$refs.canvas.getContext('2d')
      // ctx.save()
      // ctx.globalCompositeOperation = 'destination-over'
      // ctx.fillStyle = '#ccc9c9'
      // ctx.fillRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
      // ctx.restore()

      const link = document.createElement('a')
      link.setAttribute('download', 'gráfico.png')
      link.setAttribute('href', this.chart.toBase64Image())
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    submitData() {}
  }
}
</script>

<style scoped>
#canvas {
  max-width: 100%;
  max-height: 75vh;
}

.btn-margin {
  margin: 5px;
}
</style>
