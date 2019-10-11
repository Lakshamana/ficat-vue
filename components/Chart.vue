<template>
  <div>
    <canvas ref="canvas" :key="searchId" width="965" height="400"></canvas>
    <!-- <div style="text-align:center;">
      <p>Use os controles ao lado para pesquisar</p>
    </div> -->
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
    dataset: {
      type: Object,
      default: () => ({})
    },

    searchType: {
      type: String,
      default: ''
    },

    searchId: {
      type: Number,
      default: 0
    }
  },

  computed: {
    hasDataset() {
      return Object.keys(this.dataset).length > 0
    },

    getLabels() {
      return this.searchType === 'monthly' && months
    },

    ctx() {
      return this.$refs && this.$refs.canvas.getContext('2d')
    }
  },

  mounted() {
    this.createChart(this.dataset)
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
    }
  }
}
</script>
