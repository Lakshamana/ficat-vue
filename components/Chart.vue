<template>
  <div>
    <div v-show="searchId">
      <canvas id="canvas" ref="canvas"></canvas>
      <br />
      <div class="level">
        <div class="level-left"></div>
        <div class="level-right">
          <b-button
            @click="downloadImage"
            class="btn-margin"
            icon-right="download"
          />
          <b-button
            :disabled="!searchId"
            @click="getReport"
            class="btn-margin"
            icon-right="file-pdf"
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
      type: Number,
      default: 0
    },

    payload: {
      type: Object,
      default: undefined
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
          tooltips: {
            enabled: true,
            callbacks: {
              title: (items, data) => {
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
      ctx.restore()
      const link = document.createElement('a')
      link.setAttribute('download', 'gráfico.png')
      link.setAttribute('href', this.chart.toBase64Image())
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    getReport() {
      if (!this.payload) return
      this.$axios
        .get('/api/catalog-cards/q', {
          responseType: 'blob',
          params: {
            ...this.payload,
            pdf: true
          }
        })
        .then(({ data }) => {
          const link = document.createElement('a')
          link.download = `relatorio-${this.payload.year}.pdf`
          const file = new File([data], { type: 'application/pdf' })
          const url = URL.createObjectURL(file)
          link.href = url
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url)
        })
    },

    getAcdUnities() {
      this.$axios.get('/api/academic-unities').then(({ data }) => {
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
