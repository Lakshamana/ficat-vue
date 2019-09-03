<template>
  <section class="section">
    <div class="columns is-centered is-mobile">
      <div class="column is-10">
        <hooper>
          <slide>
            <card title="Dados do Autor">
              fields
            </card>
          </slide>
          <slide>
            <card title="Dados do Trabalho">
              fields
            </card>
          </slide>
          <slide>
            <card title="Orientadores">
              fields
            </card>
          </slide>
          <slide>
            <card title="Palavras-chave">
              fields
            </card>
          </slide>
          <slide>
            <card title="Preparar ficha">
              fields
            </card>
          </slide>

          <navigation slot="hooper-addons"></navigation>
          <pagination slot="hooper-addons"></pagination>
        </hooper>
      </div>
    </div>
  </section>
</template>

<script>
import { Hooper, Slide, Navigation, Pagination } from 'hooper'
import { mapState } from 'vuex'
import Card from '@/components/Card'

export default {
  name: 'Home',

  components: {
    Card,
    Hooper,
    Slide,
    Navigation,
    Pagination
  },

  data() {
    return {
      step: 0
    }
  },

  computed: {
    ...mapState({
      lang: state => state.langTag
    })
  }
}
</script>

<style>
.hooper-fit {
  width: inherit;
  height: inherit;
}
</style>
