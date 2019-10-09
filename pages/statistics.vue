<template>
  <div class="container is-fullwidth">
    <section class="section columns">
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
              :placeholder="currentYear"
              aria-placeholder="Selecione"
              rounded
              size="is-small"
            >
              <option v-for="y in years" :key="y" value="y">
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
                native-value="mensal"
              >
                Mensal
              </b-radio>
            </div>
            <div class="field">
              <b-radio
                v-model="searchPeriod"
                size="is-small"
                native-value="semestral"
              >
                Semestral
              </b-radio>
            </div>
            <div class="field">
              <b-radio
                v-model="searchPeriod"
                size="is-small"
                native-value="anual"
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
                  required
                  aria-required="true"
                  icon="magnify"
                  size="is-small"
                  @typing="getAcdUnities"
                  @select="option => (selectedAcdUnity = option)"
                >
                  <template slot="empty">
                    Nenhum resultado encontrado
                  </template>
                </b-autocomplete>
              </b-field>
            </div>
          </div>
          <br />
          <div class="columns is-centered">
            <div class="column is-10">
              <b-button class="is-info" native-type="submit" @click="send">
                Buscar
              </b-button>
            </div>
          </div>
        </form>
      </aside>
      <div class="column is-9 is-right border-red">
        <div class="columns is-centered">
          <div class="column is-12">
            <div class="d-table">
              <div class="d-cell border-black">I am the Statistics page</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import pDebounce from 'p-debounce'

export default {
  name: 'Statistics',
  layout: 'empty',
  middleware: 'auth',

  data() {
    return {
      currentYear: '' + new Date().getFullYear(),
      years: [],
      searchYear: undefined,
      searchPeriod: 'mensal',
      searchCourseType: undefined,
      loading: false,
      acdUnityPreviousSearch: '',
      academicUnities: [],
      selectedAcdUnity: undefined
    }
  },

  mounted() {
    this.getYears()
  },

  methods: {
    getYears() {
      this.$axios.get('/api/catalogCards/oldest').then(({ data }) => {
        const length = +this.currentYear - data.year + 1
        this.years = Array.from({ length }, (v, i) => +this.currentYear - i)
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

    send() {}
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
</style>
