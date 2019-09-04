<template>
  <section class="section">
    <div class="columns is-centered is-mobile">
      <div class="column is-10">
        <form @submit.prevent="onSubmit">
          <hooper class="hooper-fit">
            <slide>
              <card title="Nome do autor">
                <div class="columns">
                  <div class="column is-half">
                    <b-field>
                      <b-input
                        placeholder="Nome do autor"
                        aria-placeholder="Nome do autor"
                        validation-message="Digite letras apenas"
                        pattern="[\D]+"
                      ></b-input>
                    </b-field>
                    <b-field>
                      <b-input
                        placeholder="Sobrenome do autor"
                        aria-placeholder="Nome do autor"
                      ></b-input>
                    </b-field>
                  </div>
                  <div class="column is-half">
                    <b-field>
                      <b-input
                        placeholder="Nome do 2º autor"
                        aria-placeholder="Nome do 2º autor"
                        validation-message="Digite letras apenas"
                        pattern="[\D]+"
                      ></b-input>
                    </b-field>
                    <b-field>
                      <b-input
                        placeholder="Sobrenome do 2º autor"
                        aria-placeholder="Sobrenome do 2º autor"
                      ></b-input>
                    </b-field>
                  </div>
                </div>
              </card>
            </slide>
            <slide>
              <card title="Dados do Trabalho">
                <div class="columns">
                  <div class="column is-half">
                    <b-field>
                      <b-input
                        placeholder="Título do trabalho"
                        aria-placeholder="Título do trabalho"
                        validation-message="Mínimo de 10 caracteres"
                        minlength="10"
                      ></b-input>
                    </b-field>
                    <b-field>
                      <b-input
                        placeholder="Subtítulo do trabalho"
                        aria-placeholder="Subtítulo do trabalho"
                      ></b-input>
                    </b-field>
                    <b-field>
                      <b-select placeholder="Ano" aria-placeholder="Ano">
                        <option v-for="y in 10" :key="y" :value="y">
                          {{ getYear(y - 1) }}
                        </option>
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column is-half">
                    <b-field>
                      <b-select
                        placeholder="Ilustração"
                        aria-placeholder="Ilustração"
                      >
                        <option value="none">Não possui</option>
                        <option value="color">Coloridas</option>
                        <option value="pb">Preto e branco</option>
                      </b-select>
                    </b-field>
                    <b-field>
                      <b-autocomplete
                        v-model="name"
                        rounded
                        :data="filteredDataArray"
                        placeholder="Unidade acadêmica"
                        icon="magnify"
                        @select="option => (selected = option)"
                      >
                        <template slot="empty">
                          Nenhum resultado encontrado
                        </template>
                      </b-autocomplete>
                    </b-field>
                  </div>
                </div>
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
        </form>
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
  },

  methods: {
    getYear(y = 0) {
      return new Date(Date.now()).getFullYear() - y
    }
  }
}
</script>

<style scoped>
.hooper-fit {
  width: auto;
  height: auto;
  padding-bottom: 10px;
}
</style>
