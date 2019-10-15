<template>
  <div>
    <div v-show="searchId > 0">
      <canvas ref="canvas"></canvas>
      <br />
      <div class="level">
        <div class="level-left"></div>
        <div class="level-right">
          <b-button icon-right="download" @click="downloadImage" />
          <b-button icon-right="file-pdf" @click="submitData" />
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

const months = [
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
]

function randColors(length) {
  const alpha = rand(0, 100) / 100
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
      return this.searchType === 'monthly' && months
    },

    ctx() {
      return this.$refs && this.$refs.canvas.getContext('2d')
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
          labels: this.getLabels || Object.keys(dataset),
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
        options: {}
      })
    },

    downloadImage() {
      const link = document.createElement('a')
      link.setAttribute('download', 'image.png')
      link.setAttribute('href', this.chart.toBase64Image())
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    submitData() {}
  }
}
</script>
