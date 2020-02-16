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
            :disabled="!searchId"
            @click="getReport"
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

    acdUnitySelected: {
      type: Boolean,
      default: false
    },

    searchId: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      chart: undefined,
      acdUnities: []
    }
  },

  computed: {
    getLabels() {
      return this.labelMap[this.searchType]
    },

    ctx() {
      return this.$refs && this.$refs.canvas
    },

    labelMap() {
      return {
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
        annually: !this.acdUnitySelected ? this.acdUnities.map(u => u.name) : ''
      }
    }
  },

  mounted() {
    this.$axios.setHeader('x-xsrf-token', this.$cookies.get('xsrfToken'))
    !this.acdUnitySelected && this.getAcdUnities()
  },

  methods: {
    createChart(dataset) {
      this.chart && this.chart.destroy()
      const length = Object.keys(dataset).length
      this.chart = new Chart(this.ctx, {
        type: 'bar', // !this.acdUnitySelected ? 'polarArea' : 'bar',
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
          tooltips: {
            enabled: true,
            callbacks: {
              title: (items, data) => {
                console.log(items, data)
                return items[0].xLabel
              }
            }
          },
          scales: {
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          }
        }
      })
    },

    downloadImage() {
      const ctx = this.$refs.canvas.getContext('2d')
      ctx.save()
      ctx.globalCompositeOperation = 'destination-over'
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, this.$refs.canvas.width, this.$refs.canvas.height)
      ctx.restore()

      const link = document.createElement('a')
      link.setAttribute('download', 'gráfico.png')
      link.setAttribute('href', this.chart.toBase64Image())
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    getReport(id) {
      window.open(
        '/api/catalogCards/reportResult?pdfToken=' + this.searchId,
        '_blank'
      )
    },

    getAcdUnities() {
      this.$axios.get('/api/academicUnities').then(({ data }) => {
        this.acdUnities = data.map(({ id, name }) => ({ id, name }))
      })
    }
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
