<template>
  <section class="section center">
    <div class="columns is-centered is-mobile">
      <div class="column is-10">
        <form @submit.prevent="onSubmit">
          <hooper ref="hooper" class="hooper-fit">
            <slide>
              <card title="Dados de autoria">
                <div class="columns">
                  <div class="column is-half">
                    <input-validation
                      v-model="authorName"
                      :properties="authorNameProperties"
                      class="mb"
                      @focus="slideTo(0)"
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
                      @blur="slideTo(1)"
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
                      style="margin-bottom: 2.4em;"
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
                            <option v-for="y in 10" :key="y">
                              {{ getYear(y - 1) }}
                            </option>
                          </b-select>
                        </b-field>
                      </div>
                      <div class="column is-8">
                        <input-validation
                          v-model="totalPages"
                          :properties="totalPagesProperties"
                        >
                          <template v-slot:addon>
                            <b-select v-model="numberType" rounded>
                              <option value="roman">Romanos</option>
                              <option value="arabic">Indo-arábicos</option>
                            </b-select>
                          </template>
                        </input-validation>
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
                      <b-select
                        v-model="workType"
                        placeholder="Tipo de trabalho"
                        aria-placeholder="Tipo de trabalho"
                        required
                        aria-required="true"
                        expanded
                        rounded
                      >
                        <option value="thesis">Tese</option>
                        <option value="dissertation">Dissertação</option>
                        <option value="tccExpert">TCC (Especialização)</option>
                        <option value="tccGraduation">TCC (Graduação)</option>
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
                        @select="onSelectedAcdUnity"
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
                    <b-field v-if="selectedAcdUnity">
                      <b-select
                        v-model="selectedCourseId"
                        placeholder="Programa/Curso"
                        aria-placeholder="Programa ou Curso"
                        required
                        aria-required="true"
                        expanded
                        rounded
                      >
                        <option
                          v-for="course in courses"
                          :key="course.id"
                          :value="course.id"
                        >
                          {{ course.name }}
                        </option>
                      </b-select>
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
                      v-model="advisorName"
                      :properties="advisorNameProperties"
                      class="mb"
                    ></input-validation>
                    <input-validation
                      v-model="advisorSurname"
                      :properties="advisorSurnameProperties"
                      class="mb"
                    ></input-validation>
                    <div class="columns vcenter">
                      <div class="column is-half">
                        <div class="field">
                          <b-checkbox v-model="isFemaleAdvisor">
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
                      v-model="coadvisorName"
                      :properties="coadvisorNameProperties"
                    ></input-validation>
                    <input-validation
                      v-model="coadvisorSurname"
                      :properties="coadvisorSurnameProperties"
                    ></input-validation>
                    <div class="columns vcenter">
                      <div class="column is-half">
                        <div class="field">
                          <b-checkbox v-model="isFemaleCoadvisor">
                            Coorientadora
                          </b-checkbox>
                        </div>
                      </div>
                      <div class="column is-half">
                        <b-field>
                          <b-select
                            v-model="coadvisorTitle"
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
                      <b-button class="is-success" rounded native-type="submit">
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

import InputValidation from '@/components/InputValidation'
import Card from '@/components/Card'
import { romanize, maybe } from '@/shared/frontUtils'
const { MessageCodes } = require('../shared/messageCodes')

const pattern = '[a-zA-Z\u00C0-\u017F ]'

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
      presentationYear: '' + new Date(Date.now()).getFullYear(),
      workImagesType: undefined,
      workType: undefined,
      acdUnityPreviousSearch: '',
      knAreaPreviousSearch: '',
      coursePreviousSearch: '',
      advisorName: '',
      advisorSurname: '',
      isFemaleAdvisor: false,
      advisorTitle: undefined,
      coadvisorName: '',
      coadvisorSurname: '',
      isFemaleCoadvisor: false,
      coadvisorTitle: undefined,
      catalogFont: undefined,
      selectedAcdUnity: undefined,
      selectedKnArea: undefined,
      selectedCourseId: undefined,
      academicUnities: [],
      knAreas: [],
      courses: [],
      totalPages: undefined,
      loading: false,
      numberType: 'roman',

      authorNameProperties: {
        placeholder: 'Nome do autor',
        invalidMessages: [
          'Campo obrigatório e mínimo de 3 caracteres. Digite letras apenas'
        ],
        pattern: `${pattern}+`,
        minlength: 3,
        required: true,
        rounded: true
      },

      authorSurnameProperties: {
        placeholder: 'Sobrenome do autor',
        invalidMessages: [
          'Campo obrigatório e mínimo de 5 caracteres. Digite letras apenas'
        ],
        pattern: `${pattern}+`,
        minlength: 5,
        required: true,
        rounded: true
      },

      author2NameProperties: {
        placeholder: 'Nome do 2º autor',
        invalidMessages: ['Mínimo de 3 caracteres. Digite letras apenas'],
        defaultMessage: 'Campo opcional',
        valid: name => {
          const re = /^[a-zA-Z\u00C0-\u017F ]{3,}$/
          return name === '' || re.test(name)
        },
        rounded: true
      },

      author2SurnameProperties: {
        placeholder: 'Sobrenome do 2º autor',
        invalidMessages: ['Mínimo de 5 caracteres. Digite letras apenas'],
        defaultMessage: 'Campo opcional',
        valid: name => {
          const re = /^[a-zA-Z\u00C0-\u017F ]{5,}$/
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
        invalidMessages: ['Mínimo de 10 caracteres. Digite letras apenas'],
        defaultMessage: 'Campo opcional',
        valid: name => {
          const re = /^[a-zA-Z\u00C0-\u017F ]{10,}$/
          return name === '' || re.test(name)
        },
        rounded: true
      },

      totalPagesProperties: {
        type: 'number',
        placeholder: 'Páginas',
        invalidMessages: [
          'Campo obrigatório e somente números. Use números positivos'
        ],
        required: true,
        valid: n => n > 0,
        rounded: true
      },

      advisorNameProperties: {
        placeholder: 'Nome do(a) orientador(a)',
        invalidMessages: [
          'Campo obrigatório e somente letras. Mínimo de 3 caracteres'
        ],
        required: true,
        minlength: 3,
        pattern: `${pattern}+`,
        rounded: true
      },

      advisorSurnameProperties: {
        placeholder: 'Sobrenome do(a) orientador(a)',
        invalidMessages: ['Mínimo de 5 caracteres. Digite letras apenas'],
        required: true,
        minlength: 5,
        pattern: `${pattern}+`,
        rounded: true
      },

      coadvisorNameProperties: {
        placeholder: 'Nome do coorientador',
        invalidMessages: ['Somente letras. Mínimo de 3 caracteres'],
        defaultMessage: 'Campo opcional',
        valid: name => {
          const re = /^[a-zA-Z\u00C0-\u017F ]{3,}$/
          return name === '' || re.test(name)
        },
        rounded: true
      },

      coadvisorSurnameProperties: {
        placeholder: 'Sobrenome do(a) orientador(a)',
        invalidMessages: ['Mínimo de 5 caracteres. Digite letras apenas'],
        defaultMessage: 'Campo opcional',
        valid: name => {
          const re = /^[a-zA-Z\u00C0-\u017F ]{5,}$/
          return name === '' || re.test(name)
        },
        rounded: true
      },

      keywordProperties: {
        placeholder: 'Adicione uma palavra-chave',
        invalidMessages: [this.getKwInvalidMessage],
        required: this.requiredKeyword,
        minlength: 10,
        pattern: `${pattern}+`,
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
        authorTitle: this.$tr(this.lang, MessageCodes.layout.ltAbout)
      }
    },

    getKwInvalidMessage() {
      const prefix = this.keywords.length < 2 ? 'Campo obrigatório. ' : ''
      return `${prefix}Digite letras apenas. Mínimo de 10 caracteres`
    },

    requiredKeyword() {
      return this.keywords.length === 1
    }
  },

  methods: {
    slideTo(n) {
      // this.$refs.hooper.slideTo(n)
      console.log('sliding to ' + n)
      // console.log(evt)
    },

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

    onSelectedAcdUnity(option) {
      this.selectedAcdUnity = option
      this.getCourses()
    },

    getKnAreas: pDebounce(function(term) {
      if (!term.length) {
        this.knAreas = []
        return
      }
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
    }, 500),

    getCourses() {
      this.$axios
        .get('/api/courses', {
          params: {
            acdUnityId: this.selectedAcdUnity.id
          }
        })
        .then(response => {
          this.courses = response.data
        })
        .catch()
        .finally(() => (this.loading = false))
    },

    onSubmit() {
      const formattedTotalPages =
        this.numberType === 'roman'
          ? romanize(+this.totalPages)
          : this.totalPages
      this.$axios
        .post('/api/catalogCards', {
          keywords: this.keywords.map(kw => kw.value),
          authors: {
            authorName: this.authorName,
            authorSurname: this.authorSurname,
            ...maybe('author2Name', this.author2Name),
            ...maybe('author2Surname', this.author2Surname)
          },
          work: {
            workTitle: this.workTitle,
            ...maybe('workSubtitle', this.workSubtitle),
            presentationYear: this.presentationYear,
            workImagesType: this.workImagesType,
            totalPages: formattedTotalPages,
            workType: this.workType
          },
          advisors: {
            advisorName: this.advisorName,
            advisorSurname: this.advisorSurname,
            isFemaleAdvisor: this.isFemaleAdvisor,
            advisorTitle: this.advisorTitle,
            ...maybe('coadvisorName', this.coadvisorName),
            ...maybe('coadvisorSurname', this.coadvisorSurname),
            ...maybe('isFemaleCoadvisor', this.isFemaleCoadvisor),
            ...maybe('coadvisorTitle', this.coadvisorTitle)
          },
          academicDetails: {
            acdUnityId: this.selectedAcdUnity.id,
            knAreaId: this.selectedKnArea.id,
            courseId: this.selectedCourseId
          },
          catalogFont: this.catalogFont
        })
        .then(response => {
          const location = response.headers.location
          const id = location.substr(location.lastIndexOf('/') + 1)
          this.getPdfResult(id)
        })
        .catch()
        .finally(() => (this.loading = false))
    },

    getPdfResult(id) {
      window.open(`/api/catalogCards/get/${id}`, '_blank')
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

.center {
  margin: auto;
}

.btn-margin {
  margin: 0 0.2em 0 0.2em;
}

.mb {
  margin-bottom: 2.1em;
}
</style>
