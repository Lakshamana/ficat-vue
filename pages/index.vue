<template>
  <section class="section">
    <div class="columns is-centered is-mobile">
      <div class="column is-10">
        <div>
          <b-steps type="is-black">
            <b-step-item label="Account" icon="account-key"></b-step-item>
            <b-step-item label="Profile" icon="account"></b-step-item>
            <b-step-item label="Social" icon="account-plus"></b-step-item>
          </b-steps>
        </div>
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
  }
}
</script>
