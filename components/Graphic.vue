<template>
  <span>
    <canvas v-if="hasDataset" id="chart" ref="chart"></canvas>
    <div v-else style="text-align:center;">
      <p>Crie uma pesquisa!</p>
    </div>
  </span>
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

function randColors() {
  const alpha = rand(0, 100) / 100
  return Array.from(
    { length },
    () => `rgba(${rand(0, 255)}, ${rand(0, 255)}, ${rand(0, 255)}, ${alpha})`
  )
}

export default {
  name: 'Graphic',
  props: {
    inputDataset: {
      type: Object,
      default: () => ({})
    },

    inputSearchType: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      dataset: this.inputDataset,
      searchType: this.inputSearchType
    }
  },

  computed: {
    getLabels() {
      return this.searchType === 'monthly' && months
    },

    hasDataset() {
      return Object.keys(this.dataset).length > 0
    }
  },

  mounted() {
    this.createChart(this.dataset)
  },

  methods: {
    createChart(dataset) {
      const ctx = this.$refs.chart
      // eslint-disable-next-line no-new
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.getLabels || Object.keys(dataset),
          datasets: [
            {
              label: 'Nº de fichas registradas',
              data: Object.values(dataset),
              backgroundColor: randColors(),
              borderColor: randColors(),
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
