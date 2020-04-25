<template>
  <div class="container">
    <section class="section columns is-full-page">
      <aside class="column is-3">
        <p class="menu-label title is-hidden-touch has-text-left">
          Filtros
        </p>
        <br />
        <form @submit.prevent="onSubmit">
          <p class="menu-label is-capitalized">
            Ano
          </p>
          <b-field>
            <b-select
              v-model="searchYear"
              aria-placeholder="Selecionar ano"
              rounded
              size="is-small"
            >
              <option v-for="y in years" :key="y" :value="y">
                {{ y }}
              </option>
            </b-select>
          </b-field>
          <br />
          <p class="menu-label is-capitalized">
            Período
          </p>
          <section>
            <div class="field">
              <b-radio
                v-model="searchPeriod"
                :disabled="!selectedAcdUnity"
                size="is-small"
                native-value="monthly"
              >
                Mensal
              </b-radio>
            </div>
            <div class="field">
              <b-radio
                v-model="searchPeriod"
                :disabled="!selectedAcdUnity"
                size="is-small"
                native-value="semiannually"
              >
                Semestral
              </b-radio>
            </div>
            <div class="field">
              <b-radio
                v-model="searchPeriod"
                size="is-small"
                native-value="annually"
              >
                Anual
              </b-radio>
            </div>
          </section>
          <br />
          <p class="menu-label is-capitalized">
            Tipo <span class="is-lowercase">de</span> Curso
          </p>
          <b-field>
            <b-select
              v-model="searchCourseType"
              placeholder="Selecione"
              aria-placeholder="Selecione"
              size="is-small"
              rounded
            >
              <option value="">Todos</option>
              <option value="tccGraduation">Graduação</option>
              <option value="tccExpert">Especialização</option>
              <option value="dissertation">Mestrado</option>
              <option value="thesis">Doutorado</option>
            </b-select>
          </b-field>
          <br />
          <p class="menu-label is-capitalized">
            Unidade Acadêmica
          </p>
          <div class="columns">
            <div class="column is-half">
              <b-field>
                <b-tooltip
                  :label="tooltip"
                  :active="!!acdUnityPreviousSearch.length"
                  position="is-right"
                >
                  <b-autocomplete
                    :data="academicUnities"
                    :loading="loading"
                    @typing="getAcdUnitiesByTerm"
                    @select="onSelectedAcdUnity"
                    field="acronym"
                    placeholder="Buscar"
                    aria-placeholder="Buscar"
                    rounded
                    icon="magnify"
                    size="is-small"
                  >
                    <template #default="{ option }">
                      <span @mouseover="tooltip = option.name">
                        {{ option.acronym }}
                      </span>
                    </template>
                    <template slot="empty">
                      Nenhum resultado encontrado
                    </template>
                  </b-autocomplete>
                </b-tooltip>
              </b-field>
            </div>
          </div>
          <template v-if="selectedAcdUnity">
            <p class="menu-label is-capitalized">
              Curso
            </p>
            <b-field>
              <b-select
                v-model="selectedCourse"
                placeholder="Selecione"
                aria-placeholder="Selecione"
                size="is-small"
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
          </template>
          <br />
          <div class="columns is-centered">
            <div class="column is-10">
              <b-button class="is-info" native-type="submit">
                Buscar
              </b-button>
            </div>
          </div>
        </form>
      </aside>
      <div class="column is-9 charts is-fullheight">
        <div class="d-table">
          <div class="d-cell">
            <chart
              ref="chart"
              :search-id="searchId"
              :search-type="searchPeriod"
              :acd-unities="academicUnities"
              :acd-unity-selected="!!selectedAcdUnity"
            ></chart>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import pDebounce from 'p-debounce'
import Chart from '@/components/Chart'
import { maybe } from '@/shared/frontUtils'

export default {
  name: 'Statistics',
  layout: 'empty',
  middleware: 'auth',

  components: {
    Chart
  },

  data() {
    return {
      years: [],
      courses: [],
      searchYear: new Date().getFullYear(),
      searchPeriod: 'annually',
      searchCourseType: undefined,
      loading: false,
      acdUnityPreviousSearch: '',
      academicUnities: [],
      month: '',
      semester: '',
      selectedAcdUnity: undefined,
      selectedCourse: undefined,
      searchId: '',
      tooltip: ''
    }
  },

  mounted() {
    this.$axios.setHeader('x-xsrf-token', this.$cookies.get('xsrfToken'))
    this.getYears()
  },

  methods: {
    getYears() {
      this.$axios.get('/api/catalogCards/oldest').then(({ data }) => {
        const length = this.searchYear - data.year + 1
        this.years = Array.from({ length }, (v, i) => this.searchYear - i)
      })
    },

    // TODO: Criar uma função apenas para o pDebounce
    getAcdUnitiesByTerm: pDebounce(function(term) {
      if (!term.length) {
        this.academicUnities = []
        this.acdUnityPreviousSearch = ''
        return
      }
      // Evitar que consultas iguais sejam repetidas consecutivamente
      if (term !== this.acdUnityPreviousSearch) {
        this.loading = true
        this.acdUnityPreviousSearch = term
        this.$axios
          .get('/api/academicUnities', {
            params: {
              term
            }
          })
          .then(response => {
            this.academicUnities = response.data
          })
          .catch()
          .finally(() => (this.loading = false))
      }
    }, 500),

    getCoursesByAcdUnity(acdUnityId) {
      this.$axios
        .get('/api/courses', {
          params: {
            acdUnityId
          }
        })
        .then(({ data }) => {
          this.courses = data
        })
        .catch(err => console.log(err))
        .finally(() => (this.loading = false))
    },

    onSelectedAcdUnity(option) {
      this.selectedAcdUnity = option
      if (this.selectedAcdUnity)
        this.getCoursesByAcdUnity(this.selectedAcdUnity.id)
    },

    onSubmit() {
      this.$axios
        .post(
          '/api/catalogCards/q',
          {
            year: +this.searchYear,
            ...maybe('month', this.month),
            ...maybe('semester', this.semester),
            ...maybe(
              'unityId',
              this.selectedAcdUnity && this.selectedAcdUnity.id
            ),
            // ...maybe('courseId', this.selectedCourse.id),
            ...maybe('type', this.searchCourseType)
          },
          {
            params: {
              searchType: this.searchPeriod
            }
          }
        )
        .then(res => {
          this.searchId = res.headers.pdftoken
          this.$refs.chart.createChart(res.data)
        })
    }
  }
}
</script>

<style scoped>
.d-table {
  width: 100%;
  height: 80vh;
  display: table;
}

.d-cell {
  display: table-cell;
  vertical-align: middle;
}

.border-red {
  border: 1px solid red;
}

.border-black {
  border: 1px solid black;
}

.charts {
  background-color: #ccc9c994;
}
</style>
