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
                        v-model="authorName"
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
                        v-model="authorSurname"
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
                        v-model="author2Name"
                        placeholder="Nome do 2º autor"
                        aria-placeholder="Nome do 2º autor"
                        message="Campo opcional"
                        validation-message="Digite letras apenas"
                        pattern="[A-Za-z]+"
                      ></b-input>
                    </b-field>
                    <b-field>
                      <b-input
                        v-model="author2Surname"
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
                        v-model="workTitle"
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
                        v-model="workSubtitle"
                        placeholder="Subtítulo do trabalho"
                        aria-placeholder="Subtítulo do trabalho"
                        message="Campo opcional"
                      ></b-input>
                    </b-field>
                    <b-field>
                      <b-select
                        v-model="presentationYear"
                        placeholder="Ano de apresentação"
                        aria-placeholder="Ano de apresentação"
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
                        v-model="hasImages"
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
                        v-model="advicerName"
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
                        v-model="advicerSurname"
                        placeholder="Sobrenome do orientador"
                        aria-placeholder="Nome do orientador"
                        validation-message="Digite letras apenas"
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
                            v-model="advisorTitle"
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
                        v-model="coadvicerName"
                        placeholder="Nome do coorientador"
                        aria-placeholder="Nome do coorientador"
                        message="Campo opcional"
                        validation-message="Digite letras apenas"
                        pattern="[A-Za-z]+"
                      ></b-input>
                    </b-field>
                    <b-field>
                      <b-input
                        v-model="coadvicerSurname"
                        placeholder="Sobrenome do coorientador"
                        aria-placeholder="Nome do coorientador"
                        message="Campo opcional"
                        validation-message="Digite letras apenas"
                        pattern="[A-Za-z]+"
                      ></b-input>
                    </b-field>
                    <div class="columns vcenter">
                      <div class="column is-half">
                        <div class="field">
                          <b-checkbox v-model="femaleCoadvicer">
                            Coorientadora
                          </b-checkbox>
                        </div>
                      </div>
                      <div class="column is-half">
                        <b-field>
                          <b-select
                            v-model="coadvicerTitle"
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
                </div>
              </card>
            </slide>
            <slide>
              <card title="Palavras-chave">
                <div class="columns is-centered">
                  <div class="column is-half">
                    <div
                      v-for="(k, idx) in keywords"
                      :key="idx"
                      class="field is-grouped is-grouped"
                    >
                      <b-field>
                        <b-input
                          v-model="keywords[idx]"
                          placeholder="Adicione uma palavra-chave"
                          aria-placeholder="Adicione uma palavra-chave"
                          validation-message="Digite letras apenas. Mínimo de 10 caracteres"
                          required
                          aria-required="true"
                          minlength="10"
                          pattern="[A-Za-z]+"
                        ></b-input>
                      </b-field>
                      <div style="padding-left: 1em; display: inline;">
                        <b-button
                          icon-right="plus"
                          class="is-success is-round is-outlined"
                          :disabled="keywords.length > 4"
                          @click="keywords.push('')"
                        ></b-button>
                        <b-button
                          v-if="idx > 0"
                          icon-right="minus"
                          class="is-danger is-round btn-margin is-outlined"
                          @click="keywords.splice(idx, 1)"
                        ></b-button>
                      </div>
                    </div>
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
                        v-model="catalogFont"
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

  data() {
    return {
      keywords: ['']
    }
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

.btn-margin {
  margin: 0 0.2em 0 0.2em;
}
</style>
