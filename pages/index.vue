<template>
  <section class="section center">
    <div class="columns is-centered is-mobile">
      <div class="column is-10">
        <form @submit.prevent="onSubmit">
          <hooper class="hooper-fit">
            <slide>
              <card title="Nome do autor">
                <div class="columns">
                  <div class="column is-half">
                    <input-validation
                      v-model="authorName"
                      :properties="authorNameProperties"
                    ></input-validation>
                    <input-validation
                      v-model="authorSurname"
                      :properties="authorSurnameProperties"
                    ></input-validation>
                  </div>
                  <div class="column is-half">
                    <input-validation
                      v-model="author2Name"
                      :properties="author2NameProperties"
                    ></input-validation>
                    <input-validation
                      v-model="author2Surname"
                      :properties="author2SurnameProperties"
                    ></input-validation>
                  </div>
                </div>
              </card>
            </slide>
            <slide>
              <card title="Dados do Trabalho">
                <div class="columns">
                  <div class="column is-half">
                    <input-validation
                      v-model="workTitle"
                      :properties="workTitleProperties"
                    ></input-validation>
                    <input-validation
                      v-model="workSubtitle"
                      :properties="workSubtitleProperties"
                    ></input-validation>
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
                        <input-validation
                          v-model="totalPages"
                          :properties="totalPagesProperties"
                        ></input-validation>
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
                        aria-required="true"
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
                        required
                        aria-required="true"
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
                    <input-validation
                      v-model="advicerName"
                      :properties="advicerNameProperties"
                    ></input-validation>
                    <input-validation
                      v-model="advicerSurname"
                      :properties="advicerSurnameProperties"
                    ></input-validation>
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
                            required
                            aria-required="true"
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
                    <input-validation
                      v-model="coadvicerName"
                      :properties="coadvicerNameProperties"
                    ></input-validation>
                    <input-validation
                      v-model="coadvicerSurname"
                      :properties="coadvicerSurnameProperties"
                    ></input-validation>
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
                      :key="k.id"
                      class="field is-grouped is-grouped"
                    >
                      <input-validation
                        v-model="k.value"
                        :properties="keywordProperties"
                      ></input-validation>
                      <div style="padding-left: 1em; display: inline;">
                        <b-button
                          icon-right="plus"
                          class="is-success is-round is-outlined"
                          :disabled="keywords.length > 4"
                          @click="keywords.push(newKeyword())"
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
      keywords: [this.newKeyword()],
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
      advisorTitle: undefined,
      coadvicerName: '',
      coadvicerSurname: '',
      isFemaleCoadvicer: false,
      coadvicerTitle: undefined,
      catalogFont: '',
      selectedAcdUnity: undefined,
      selectedKnArea: undefined,
      academicUnities: [],
      knAreas: [],
      totalPages: undefined,
      loading: false,

      authorNameProperties: {
        placeholder: 'Nome do autor',
        invalidMessages: [
          'Campo obrigatório e mínimo de 6 letras. Digite letras apenas'
        ],
        pattern: '[A-Za-z]+',
        minlength: 6,
        required: true,
        rounded: true
      },

      authorSurnameProperties: {
        placeholder: 'Sobrenome do autor',
        invalidMessages: [
          'Campo obrigatório e mínimo de 6 letras. Digite letras apenas'
        ],
        pattern: '[A-Za-z]+',
        minlength: 6,
        required: true,
        rounded: true
      },

      author2NameProperties: {
        placeholder: 'Nome do 2º autor',
        invalidMessages: ['Mínimo de 6 letras. Digite letras apenas'],
        defaultMessage: 'Campo opcional',
        valid: name => {
          const re = /^[A-Za-z]{6,}$/
          return name === '' || re.test(name)
        },
        rounded: true
      },

      author2SurnameProperties: {
        placeholder: 'Sobrenome do 2º autor',
        invalidMessages: ['Mínimo de 6 letras. Digite letras apenas'],
        defaultMessage: 'Campo opcional',
        valid: name => {
          const re = /^[A-Za-z]{6,}$/
          return name === '' || re.test(name)
        },
        rounded: true
      },

      workTitleProperties: {
        placeholder: 'Título do trabalho',
        invalidMessages: ['Campo obrigatório e mínimo de 10 caracteres'],
        required: true,
        minlength: 10,
        rounded: true
      },

      workSubtitleProperties: {
        placeholder: 'Subtítulo do trabalho',
        invalidMessages: ['Campo obrigatório e mínimo de 10 caracteres'],
        required: true,
        minlength: 10,
        rounded: true
      },

      totalPagesProperties: {
        type: 'number',
        placeholder: 'Número de páginas',
        invalidMessages: ['Campo obrigatório e somente números'],
        required: true,
        pattern: '[0-9]+',
        rounded: true
      },

      advicerNameProperties: {
        placeholder: 'Nome do(a) orientador(a)',
        invalidMessages: [
          'Campo obrigatório e somente letras. Mínimo de 10 caracteres'
        ],
        required: true,
        pattern: '[A-Za-z]+',
        rounded: true
      },

      advicerSurnameProperties: {
        placeholder: 'Sobrenome do(a) orientador(a)',
        invalidMessages: ['Digite letras apenas'],
        required: true,
        pattern: '[A-Za-z]+',
        rounded: true
      },

      coadvicerNameProperties: {
        placeholder: 'Nome do coorientador',
        invalidMessages: ['Somente letras. Mínimo de 10 caracteres'],
        pattern: '[A-Za-z]*',
        rounded: true
      },

      coadvicerSurnameProperties: {
        placeholder: 'Sobrenome do(a) orientador(a)',
        invalidMessages: ['Digite letras apenas'],
        defaultMessage: 'Campo opcional',
        pattern: '[A-Za-z]*',
        rounded: true
      },

      keywordProperties: {
        placeholder: 'Adicione uma palavra-chave',
        invalidMessages: [],
        required: this.requiredKeyword,
        minlength: 10,
        pattern: '[A-Za-z]+',
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
    },

    getKwInvalidMessage() {
      const prefix = this.keywords.length === 1 ? 'Campo obrigatório. ' : ''
      return `${prefix}Digite letras apenas. Mínimo de 10 caracteres`
    },

    requiredKeyword() {
      return this.keywords.length === 1
    }
  },

  methods: {
    newKeyword() {
      return { id: new Date().getTime(), value: '' }
    },

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
          .catch()
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
          .catch()
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

.center {
  margin: auto;
}

.btn-margin {
  margin: 0 0.2em 0 0.2em;
}
</style>
