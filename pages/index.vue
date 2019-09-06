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
                    <input-validation
                      ref="authorNameIpt"
                      :properties="authorNameProperties"
                    ></input-validation>
                    <b-field>
                      <b-input
                        v-model="authorSurname"
                        placeholder="Sobrenome do autor"
                        aria-placeholder="Nome do autor"
                        validation-message="Campo obrigatório. Digite letras apenas"
                        pattern="[A-Za-z]+"
                        required
                        aria-required="true"
                        rounded
                      ></b-input>
                    </b-field>
                  </div>
                  <div class="column is-half">
                    <b-field message="Campo opcional">
                      <b-input
                        v-model="author2Name"
                        placeholder="Nome do 2º autor"
                        aria-placeholder="Nome do 2º autor"
                        validation-message="Digite letras apenas"
                        pattern="[A-Za-z]+"
                        rounded
                      ></b-input>
                    </b-field>
                    <b-field message="Campo opcional">
                      <b-input
                        v-model="author2Surname"
                        placeholder="Sobrenome do 2º autor"
                        aria-placeholder="Sobrenome do 2º autor"
                        rounded
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
                        rounded
                      ></b-input>
                    </b-field>
                    <b-field message="Campo opcional">
                      <b-input
                        v-model="workSubtitle"
                        placeholder="Subtítulo do trabalho"
                        aria-placeholder="Subtítulo do trabalho"
                        rounded
                      ></b-input>
                    </b-field>
                    <div class="columns">
                      <div class="column is-4">
                        <b-field>
                          <b-select
                            v-model="presentationYear"
                            placeholder="Ano"
                            aria-placeholder="Ano"
                            required
                            aria-required="true"
                            rounded
                          >
                            <option v-for="y in 10" :key="y" :value="y">
                              {{ getYear(y - 1) }}
                            </option>
                          </b-select>
                        </b-field>
                      </div>
                      <div class="column is-8">
                        <b-field>
                          <b-input
                            v-model="pageNumber"
                            type="number"
                            placeholder="Número de páginas"
                            aria-placeholder="Número de páginas"
                            validation-message="Campo obrigatório e somente números"
                            required
                            pattern="[0-9]+"
                            aria-required="true"
                            rounded
                          ></b-input>
                        </b-field>
                      </div>
                    </div>
                  </div>
                  <div class="column is-half">
                    <b-field>
                      <b-select
                        v-model="workImagesType"
                        placeholder="Ilustração"
                        aria-placeholder="Ilustração"
                        required
                        aria-required="true"
                        expanded
                        rounded
                      >
                        <option value="nocolor">Não possui</option>
                        <option value="color">Coloridas</option>
                        <option value="pb">Preto e branco</option>
                      </b-select>
                    </b-field>
                    <b-field>
                      <b-autocomplete
                        :data="academicUnities"
                        placeholder="Unidade acadêmica"
                        aria-placeholder="Unidade acadêmica"
                        :loading="loading"
                        field="name"
                        required
                        rounded
                        icon="magnify"
                        @typing="getAcdUnities"
                        @select="option => (selectedAcdUnity = option)"
                      >
                        <template slot="empty">
                          Nenhum resultado encontrado
                        </template>
                      </b-autocomplete>
                    </b-field>
                    <b-field>
                      <b-autocomplete
                        :data="knAreas"
                        placeholder="Área de conhecimento"
                        aria-placeholder="Área de conhecimento"
                        :loading="loading"
                        field="description"
                        rounded
                        icon="magnify"
                        @typing="getKnAreas"
                        @select="option => (selectedKnArea = option)"
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
                        rounded
                      ></b-input>
                    </b-field>
                    <b-field>
                      <b-input
                        v-model="advicerSurname"
                        placeholder="Sobrenome do orientador"
                        aria-placeholder="Nome do orientador"
                        validation-message="Digite letras apenas"
                        pattern="[A-Za-z]+"
                        rounded
                      ></b-input>
                    </b-field>
                    <div class="columns vcenter">
                      <div class="column is-half">
                        <div class="field">
                          <b-checkbox v-model="isFemaleAdvicer">
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
                        rounded
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
                        rounded
                      ></b-input>
                    </b-field>
                    <div class="columns vcenter">
                      <div class="column is-half">
                        <div class="field">
                          <b-checkbox v-model="isFemaleCoadvicer">
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
import pDebounce from 'p-debounce'
import codes from '../shared/messageCodes'

import InputValidation from '@/components/InputValidation'
import Card from '@/components/Card'

export default {
  name: 'Home',

  components: {
    Card,
    Hooper,
    Slide,
    Navigation,
    Pagination,
    InputValidation
  },

  data() {
    return {
      keywords: [''],
      authorName: '',
      authorSurname: '',
      author2Name: '',
      author2Surname: '',
      workTitle: '',
      workSubtitle: '',
      presentationYear: undefined,
      workImagesType: undefined,
      acdUnityPreviousSearch: '',
      knAreaPreviousSearch: '',
      advicerName: '',
      advicerSurname: '',
      isFemaleAdvicer: false,
      advisorTitle: '',
      coadvicerName: '',
      coadvicerSurname: '',
      isFemaleCoadvicer: false,
      coadvicerTitle: '',
      catalogFont: '',
      selectedAcdUnity: undefined,
      selectedKnArea: undefined,
      academicUnities: [],
      knAreas: [],
      pageNumber: undefined,
      loading: false,

      authorNameProperties: {
        placeholder: 'Nome do autor',
        type: 'text',
        ariaPlaceholder: 'Nome do autor',
        invalidMessages: ['Campo obrigatório. Digite letras apenas'],
        pattern: '[A-Za-z]+',
        minlength: 6,
        required: true,
        ariaRequired: true,
        rounded: true
      }
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
    getYear(y) {
      return '' + (new Date(Date.now()).getFullYear() - y)
    },

    getAcdUnities: pDebounce(function(term) {
      if (!term.length) {
        this.academicUnities = []
        return
      }
      // Evitar que consultas iguais sejam repetidas
      if (term !== this.acdUnityPreviousSearch) {
        this.loading = true
        this.acdUnityPreviousSearch = term
        this.$axios
          .get('/api/academicUnities', {
            params: {
              name: term
            }
          })
          .then(response => {
            this.academicUnities = response.data
          })
          .catch(console.log)
          .finally(() => (this.loading = false))
      }
    }, 500),

    getKnAreas: pDebounce(function(term) {
      // Evitar que consultas iguais sejam repetidas
      if (term !== this.knAreaPreviousSearch) {
        this.knAreaPreviousSearch = term
        this.$axios
          .get('/api/knowledgeAreas', {
            params: {
              description: term
            }
          })
          .then(response => {
            this.knAreas = response.data
          })
          .catch(console.log)
          .finally(() => (this.loading = false))
      }
    }, 500)
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
