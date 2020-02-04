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
            type="text"
          >
            <template #required>
              Field is required
            </template>
            <template #minLength="{ props }">
              Must have a {{ props.min }} chars minima
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
            <template #minLength="{ props }">
              Must have a {{ props.min }} chars minima
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
              <option v-for="y in 10" :key="y">
                {{ getYear(y - 1) }}
              </option>
            </input-validation>
            <input-validation
              v-model="$v.totalPages.$model"
              label="Pages Count"
              field-name="totalPages"
              :validations="$options.validations.totalPages"
              :v="$v"
            >
              <template #addon>
                <b-select v-model="numberType" rounded>
                  <option value="roman">Roman</option>
                  <option value="arabic">Arabic</option>
                </b-select>
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
          >
            <template #required>
              Field is required
            </template>
            <template #minLength="{ props }">
              Must have a {{ props.min }} chars minima
            </template>
          </input-validation>
          <!-- <input-validation
            v-model="$v.author2Surname.$model"
            label="Second Author Surname"
            field-name="author2Surname"
            :validations="$options.validations.author2Surname"
            :v="$v"
            type="text"
          >
            <template #required>
              Field is required
            </template>
            <template #minLength="{ props }">
              Must have a {{ props.min }} chars minima
            </template>
          </input-validation> -->
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import { required, minLength, numeric } from 'vuelidate/lib/validators'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation'

export default {
  name: 'AuthorshipForm',
  components: { Card, InputValidation },
  data() {
    return {
      workTitle: '',
      workSubtitle: '',
      presentationYear: '' + new Date(Date.now()).getFullYear(),
      numberType: 'roman',
      workImagesType: undefined,
      workType: undefined
    }
  },

  watch: {
    $v: {
      deep: true,
      handler($v) {
        $v.anyDirty && !$v.anyError && this.$emit('ready')
      }
    }
  },

  methods: {
    filterModels() {
      return Object.keys(this.$v).filter(k => !k.startsWith('$'))
    },

    getYear(y) {
      return '' + (new Date(Date.now()).getFullYear() - y)
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
      numeric
    },
    presentationYear: {
      required
    },
    workImagesType: {
      required
    },
    workType: {
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
  justify-content: space-evenly;
}

.columns {
  height: 30vh;
}
</style>
