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
                        validation-message="Campo obrigatório. Digite letras apenas"
                        pattern="[A-Za-z]+"
                        required
                        aria-required="true"
                      ></b-input>
                    </b-field>
                    <b-field>
                      <b-input
                        placeholder="Sobrenome do autor"
                        aria-placeholder="Nome do autor"
                        pattern="[A-Za-z]+"
                        required
                        aria-required="true"
                      ></b-input>
                    </b-field>
                  </div>
                  <div class="column is-half">
                    <b-field>
                      <b-input
                        placeholder="Nome do 2º autor"
                        aria-placeholder="Nome do 2º autor"
                        message="Campo opcional"
                        validation-message="Digite letras apenas"
                        pattern="[A-Za-z]+"
                      ></b-input>
                    </b-field>
                    <b-field>
                      <b-input
                        placeholder="Sobrenome do 2º autor"
                        aria-placeholder="Sobrenome do 2º autor"
                        message="Campo opcional"
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
                        required
                        aria-required="true"
                        minlength="10"
                      ></b-input>
                    </b-field>
                    <b-field>
                      <b-input
                        placeholder="Subtítulo do trabalho"
                        aria-placeholder="Subtítulo do trabalho"
                        message="Campo opcional"
                      ></b-input>
                    </b-field>
                    <b-field>
                      <b-select
                        placeholder="Ano"
                        aria-placeholder="Ano"
                        rounded
                      >
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
                        rounded
                      >
                        <option value="none">Não possui</option>
                        <option value="color">Coloridas</option>
                        <option value="pb">Preto e branco</option>
                      </b-select>
                    </b-field>
                    <b-field>
                      <b-autocomplete
                        v-model="acdUnity"
                        rounded
                        :data="filteredDataArray"
                        placeholder="Unidade acadêmica"
                        aria-placeholder="Unidade acadêmica"
                        required
                        icon="magnify"
                        @select="option => (selected = option)"
                      >
                        <template slot="empty">
                          Nenhum resultado encontrado
                        </template>
                      </b-autocomplete>
                    </b-field>
                    <b-field>
                      <b-autocomplete
                        v-model="knArea"
                        rounded
                        :data="filteredDataArray"
                        placeholder="Área de conhecimento"
                        aria-placeholder="Unidade acadêmica"
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
                <div class="columns">
                  <div class="column is-half">
                    <b-field>
                      <b-input
                        placeholder="Nome do orientador"
                        aria-placeholder="Nome do orientador"
                        validation-message="Campo obrigatório. Digite letras apenas"
                        required
                        aria-required="true"
                        pattern="[A-Za-z]+"
                      ></b-input>
                    </b-field>
                    <b-field>
                      <b-input
                        placeholder="Sobrenome do orientador"
                        aria-placeholder="Nome do orientador"
                        validation-message="Campo obrigatório. Digite letras apenas"
                        pattern="[A-Za-z]+"
                      ></b-input>
                    </b-field>
                    <div class="columns vcenter">
                      <div class="column is-half">
                        <div class="field">
                          <b-checkbox v-model="femaleAdvicer">
                            Orientadora
                          </b-checkbox>
                        </div>
                      </div>
                      <div class="column is-half">
                        <b-field>
                          <b-select
                            placeholder="Titulação"
                            aria-placeholder="Titulação"
                            rounded
                          >
                            <option value="graduate">Graduado</option>
                            <option value="expert">Especialista</option>
                            <option value="master">Mestre</option>
                            <option value="doctor">Doutor</option>
                          </b-select>
                        </b-field>
                      </div>
                    </div>
                  </div>
                  <div class="column is-half">
                    <b-field>
                      <b-input
                        placeholder="Nome do coorientador"
                        aria-placeholder="Nome do coorientador"
                        message="Campo opcional"
                        validation-message="Digite letras apenas"
                        pattern="[A-Za-z]+"
                      ></b-input>
                    </b-field>
                    <b-field>
                      <b-input
                        placeholder="Sobrenome do coorientador"
                        aria-placeholder="Nome do coorientador"
                        message="Campo opcional"
                        validation-message="Digite letras apenas"
                        pattern="[A-Za-z]+"
                      ></b-input>
                    </b-field>
                  </div>
                </div>
              </card>
            </slide>
            <slide>
              <card title="Palavras-chave">
                <div class="columns is-centered">
                  <div class="column is-half">
                    <b-field>
                      <b-input
                        placeholder="Adicione uma palavra-chave"
                        aria-placeholder="Adicione uma palavra-chave"
                        validation-message="Digite letras apenas. Mínimo de 10 caracteres"
                        required
                        aria-required="true"
                        minlength="10"
                        pattern="[A-Za-z]+"
                      ></b-input>
                    </b-field>
                  </div>
                </div>
              </card>
            </slide>
            <slide>
              <card title="Preparar ficha">
                <div class="columns is-centered">
                  <div class="column is-4">
                    <b-field>
                      <b-select
                        placeholder="Fonte"
                        aria-placeholder="Fonte"
                        rounded
                        expanded
                      >
                        <option value="times">Times New Roman</option>
                        <option value="arial">Arial</option>
                      </b-select>
                    </b-field>
                    <div style="border: 1px solid black;margin: 3em auto;">
                      recaptcha
                    </div>
                    <b-field>
                      <b-button class="is-success" rounded expanded>
                        Gerar ficha catalográfica
                      </b-button>
                    </b-field>
                  </div>
                </div>
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

.vcenter {
  align-items: center;
}
</style>
