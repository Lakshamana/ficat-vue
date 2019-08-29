<template>
  <section class="section">
    <div class="columns is-centered is-mobile">
      <div class="column is-10">
        <card title="Passo1">
          Cadastro de ficha: adicionar campos de cadastro de ficha
        </card>
      </div>
    </div>
  </section>
</template>

<script>
import Card from '~/components/Card'

export default {
  name: 'Home',

  components: {
    Card
  },

  data() {
    return {
      step: 0
    }
  }
}
</script>
