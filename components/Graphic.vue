<template>
  <canvas id="chart" ref="chart"></canvas>
</template>

<script>
import Chart from 'chartjs'

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

export default {
  name: 'Graphic',
  props: {
    dataset: {
      type: Object,
      default: () => ({})
    }
  },

  methods: {
    createChart() {
      // const length = this.dataset.length
      const ctx = document.getElementById('chart')
      const x = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: months || Object.keys(this.dataset),
          datasets: [
            {
              label: 'Nº de fichas registradas',
              data: Object.values(this.dataset),
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              borderWidth: 1
            }
          ]
        },
        options: {}
      })
      console.log(x)
    }
  }
}
</script>
