<template>
  <section class="section">
    <div class="columns is-centered is-mobile">
      <div class="column is-10">
        <hooper>
          <slide>
            <card title="Nome do autor">
              <div class="columns">
                <div class="column is-half">
                  <b-field>
                    <b-input
                      placeholder="Nome do autor"
                      aria-placeholder="Nome do autor"
                      required
                    ></b-input>
                  </b-field>
                  <b-field>
                    <b-input
                      placeholder="Sobrenome do autor"
                      aria-placeholder="Nome do autor"
                    ></b-input>
                  </b-field>
                </div>
              </div>
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
import codes from '../shared/messageCodes'
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

  computed: {
    ...mapState({
      lang: state => state.lang.langTag
    }),

    translations() {
      return {
        authorTitle: this.$tr(this.lang, codes.layout.ltAbout)
      }
    }
  }
}
</script>

<style>
.hooper-fit {
  width: inherit;
  height: inherit;
}
</style>
