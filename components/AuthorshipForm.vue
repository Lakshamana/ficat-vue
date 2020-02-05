<template>
  <Card title="Authorship Data">
    <div class="columns">
      <div class="column is-half">
        <div class="input-float">
          <input-validation
            v-model="$v.authorName.$model"
            label="Author Name"
            field-name="authorName"
            :validations="$options.validations.authorName"
            :v="$v"
            :options="{
              expanded: true
            }"
          >
            <template #required>
              Field is required
            </template>
            <template #minLength="{ props }">
              Must have a {{ props.min }} chars minima
            </template>
          </input-validation>
          <input-validation
            v-model="$v.authorSurname.$model"
            label="Author Surname"
            field-name="authorSurname"
            :validations="$options.validations.authorSurname"
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
        </div>
      </div>
      <div class="column is-half">
        <div class="input-float">
          <input-validation
            v-model="$v.author2Name.$model"
            label="Second Author Name"
            field-name="author2Name"
            :validations="$options.validations.author2Name"
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
          </input-validation>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation.js'

export default {
  name: 'AuthorshipForm',
  components: { Card, InputValidation },
  data() {
    return {
      authorName: '',
      authorSurname: '',
      author2Name: '',
      author2Surname: ''
    }
  },

  watch: {
    $v: {
      deep: true,
      handler($v) {
        ;(!$v.$invalid && this.$emit('ready')) || this.$emit('preventforward')
      }
    }
  },

  methods: {
    filterModels() {
      return Object.keys(this.$v).filter(k => !k.startsWith('$'))
    }
  },

  validations: {
    authorName: {
      required,
      minLength: minLength(3)
    },
    authorSurname: {
      required,
      minLength: minLength(5)
    },
    author2Name: {
      minLength: minLength(3)
    },
    author2Surname: {
      minLength: minLength(5)
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
