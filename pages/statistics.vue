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
                size="is-small"
                native-value="monthly"
              >
                Mensal
              </b-radio>
            </div>
            <div class="field">
              <b-radio
                v-model="searchPeriod"
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
                <b-autocomplete
                  :data="academicUnities"
                  field="name"
                  placeholder="Buscar"
                  aria-placeholder="Buscar"
                  :loading="loading"
                  rounded
                  icon="magnify"
                  size="is-small"
                  @typing="getAcdUnities"
                  @select="onSelectedAcdUnity"
                >
                  <template slot="empty">
                    Nenhum resultado encontrado
                  </template>
                </b-autocomplete>
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
              :dataset="dataset"
              :search-id="searchId"
              :search-type="searchPeriod"
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
      searchPeriod: 'monthly',
      searchCourseType: undefined,
      loading: false,
      acdUnityPreviousSearch: '',
      academicUnities: [],
      month: '',
      semester: '',
      selectedAcdUnity: undefined,
      selectedCourse: undefined,
      dataset: {},
      searchId: 0
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
        .then(({ data }) => {
          this.dataset = data
          this.searchId++
          this.$refs.chart.createChart(data)
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
