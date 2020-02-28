<template>
  <Card title="Work Data">
    <div class="columns">
      <div class="column is-half">
        <div class="input-float">
          <input-validation
            v-model="$v.workTitle.$model"
            label="Work Title"
            field-name="workTitle"
            :validations="$options.validations.workTitle"
            :v="$v"
          >
            <template #required>
              Field is required
            </template>
            <template #minLength="{ min }">
              Must have a {{ min }} chars minima
            </template>
          </input-validation>
          <input-validation
            v-model="$v.workSubtitle.$model"
            label="Work Subtitle"
            field-name="workSubtitle"
            :validations="$options.validations.workSubtitle"
            :v="$v"
            type="text"
          >
            <template #required>
              Field is required
            </template>
            <template #minLength="{ min }">
              Must have a {{ min }} chars minima
            </template>
          </input-validation>
          <b-field label="Ano" label-position="on-border" grouped>
            <input-validation
              v-model="$v.presentationYear.$model"
              use-component="b-select"
              field-name="presentationYear"
              label="Ano"
              :validations="$options.validations.presentationYear"
              :v="$v"
            >
              <template #component>
                <option v-for="y in 10" :key="y">
                  {{ getYear(y - 1) }}
                </option>
              </template>
            </input-validation>
            <input-validation
              v-model="$v.totalPages.$model"
              label="Pages Count"
              field-name="totalPages"
              :validations="$options.validations.totalPages"
              :v="$v"
              type="number"
            >
              <template #addon>
                <b-select v-model="numberType" rounded>
                  <option value="arabic">Arabic</option>
                  <option value="roman">Roman</option>
                </b-select>
              </template>
              <template #required>
                Field is required
              </template>
              <template #minValue="{ min }">
                Minimum value is {{ min }}
              </template>
            </input-validation>
          </b-field>
        </div>
      </div>
      <div class="column is-half">
        <div class="input-float">
          <input-validation
            v-model="$v.workImagesType.$model"
            label="Illustrations"
            use-component="b-select"
            field-name="workImagesType"
            :validations="$options.validations.workImagesType"
            :v="$v"
            :options="{
              expanded: true
            }"
          >
            <template #component>
              <option value="nocolor">Não possui</option>
              <option value="color">Coloridas</option>
              <option value="bw">Preto e branco</option>
            </template>
            <template #required>
              Field is required
            </template>
          </input-validation>
          <input-validation
            v-model="$v.workType.$model"
            label="Work Type"
            field-name="workType"
            :validations="$options.validations.workType"
            :v="$v"
            use-component="b-select"
            :options="{
              expanded: true
            }"
          >
            <template #component>
              <option value="thesis">Tese</option>
              <option value="dissertation">Dissertação</option>
              <option value="tccExpert">TCC (Especialização)</option>
              <option value="tccGraduation">TCC (Graduação)</option>
            </template>
            <template #required>
              Field is required
            </template>
          </input-validation>
          <input-validation
            v-model="$v.knArea.$model"
            use-component="b-autocomplete"
            field-name="knArea"
            :validations="$options.validations.knArea"
            :v="$v"
            label="Knowledge Area"
            :options="{
              expanded: true,
              loading,
              field: 'description',
              data: knAreas,
              icon: 'magnify'
            }"
            :wrapped-slots="h => renderTemplates(h, 'description')"
            @typing="getKnAreas"
            @select="option => (selectedKnArea = option)"
          >
            <template #required>
              Field is required
            </template>
          </input-validation>
          <input-validation
            v-model="$v.acdUnity.$model"
            use-component="b-autocomplete"
            field-name="acdUnity"
            :validations="$options.validations.acdUnity"
            :v="$v"
            label="Academic Unity"
            :options="{
              expanded: true,
              loading,
              field: 'name',
              data: academicUnities,
              icon: 'magnify'
            }"
            :wrapped-slots="h => renderTemplates(h, 'name')"
            @typing="getAcdUnities"
            @select="onSelectedAcdUnity"
          >
            <template #required>
              Field is required
            </template>
          </input-validation>
          <template v-if="selectedAcdUnity">
            <input-validation
              v-model="$v.course.$model"
              label="Course"
              field-name="course"
              :validations="$options.validations.course"
              :v="$v"
              use-component="b-select"
              :options="{
                expanded: true
              }"
            >
              <template #component>
                <option v-for="c in courses" :key="c.id" :value="'' + c.id">
                  {{ c.name }}
                </option>
              </template>
              <template #required>
                Field is required
              </template>
            </input-validation>
          </template>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import pDebounce from 'p-debounce'
import { required, minLength, minValue } from 'vuelidate/lib/validators'
import { recovery, replace } from '~/front/persistence'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation.js'

export default {
  name: 'WorkForm',
  components: { Card, InputValidation },
  data() {
    const { work } = recovery('form')
    return {
      workTitle: work.workTitle,
      workSubtitle: work.workSubtitle,
      presentationYear: work.presentationYear,
      numberType: work.numberType,
      totalPages: work.totalPages,
      workImagesType: work.workImagesType,
      workType: work.workType,
      course: work.course,
      loading: work.loading,
      knAreas: work.knAreas,
      academicUnities: work.academicUnities,
      courses: work.courses,
      selectedKnArea: work.selectedKnArea,
      selectedAcdUnity: work.selectedAcdUnity,
      acdUnity: work.acdUnity,
      knArea: work.knArea,
      knAreaPreviousSearch: '',
      acdUnityPreviousSearch: ''
    }
  },

  watch: {
    $v: {
      deep: true,
      handler($v) {
        replace('form', { work: this.$data })
        ;(!$v.$invalid && this.$emit('ready')) || this.$emit('preventforward')
      }
    }
  },

  mounted() {
    ;(!this.$v.$invalid && this.$emit('ready')) || this.$emit('preventforward')
  },

  beforeCreate() {
    if (!recovery('form').work)
      replace('form', {
        work: {
          workTitle: '',
          workSubtitle: '',
          presentationYear: '' + new Date(Date.now()).getFullYear(),
          numberType: 'arabic',
          totalPages: '',
          workImagesType: 'nocolor',
          workType: 'thesis',
          course: undefined,
          loading: false,
          knAreas: [],
          academicUnities: [],
          courses: [],
          selectedKnArea: undefined,
          selectedAcdUnity: undefined,
          selectedCourse: undefined,
          acdUnity: '',
          knArea: ''
        }
      })
  },

  methods: {
    filterModels() {
      return Object.keys(this.$v).filter(k => !k.startsWith('$'))
    },

    getYear(y) {
      return '' + (new Date(Date.now()).getFullYear() - y)
    },

    renderTemplates(h, field) {
      return [
        h(
          'template',
          {
            slot: 'empty'
          },
          'No result found'
        )
      ]
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

    onSelectedAcdUnity(option) {
      this.selectedAcdUnity = option
      if (this.selectedAcdUnity)
        this.getCoursesByAcdUnity(this.selectedAcdUnity.id)
    },

    getCoursesByAcdUnity(acdUnityId) {
      this.$axios
        .get('/api/courses', {
          params: {
            acdUnityId
          }
        })
        .then(response => {
          this.courses = response.data
        })
        .catch()
        .finally(() => (this.loading = false))
    }
  },

  validations: {
    workTitle: {
      required,
      minLength: minLength(10)
    },
    workSubtitle: {
      minLength: minLength(10)
    },
    totalPages: {
      required,
      minValue: minValue(1)
    },
    presentationYear: {
      required
    },
    workImagesType: {
      required
    },
    workType: {
      required
    },
    knArea: {
      required: (_, vm) => !!vm.selectedKnArea
    },
    acdUnity: {
      required: (_, vm) => !!vm.selectedAcdUnity
    },
    course: {
      required
    }
  }
}
</script>

<style scoped>
.input-float {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
