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
            tooltip-label="the work's author name"
            :options="{
              expanded: true
            }"
          >
            <template #required>
              Field is required
            </template>
            <template #minLength="{ min }">
              Must have a {{ min }} chars minima
            </template>
          </input-validation>
          <input-validation
            v-model="$v.authorSurname.$model"
            label="Author Surname"
            field-name="authorSurname"
            :validations="$options.validations.authorSurname"
            tooltip-label="the work's author surname"
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
        </div>
      </div>
      <div class="column is-half">
        <div class="input-float">
          <input-validation
            v-model="$v.author2Name.$model"
            label="Second Author Name"
            field-name="author2Name"
            :validations="$options.validations.author2Name"
            tooltip-label="the second work's author name"
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
          <input-validation
            v-model="$v.author2Surname.$model"
            label="Second Author Surname"
            field-name="author2Surname"
            :validations="$options.validations.author2Surname"
            tooltip-label="the second work's author name"
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
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import { recovery, replace } from '~/front/persistence'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation.js'

export default {
  name: 'AuthorshipForm',
  components: { Card, InputValidation },
  data() {
    const { authors } = recovery('form')
    return {
      authorName: authors.authorName,
      authorSurname: authors.authorSurname,
      author2Name: authors.author2Name,
      author2Surname: authors.author2Surname
    }
  },

  watch: {
    $v: {
      deep: true,
      handler($v) {
        replace('form', { authors: { ...this.$data } })
        ;(!$v.$invalid && this.$emit('ready')) || this.$emit('preventforward')
      }
    }
  },

  beforeCreate() {
    if (!recovery('form').authors)
      replace('form', {
        authors: {
          authorName: '',
          authorSurname: '',
          author2Name: '',
          author2Surname: ''
        }
      })
  },

  mounted() {
    ;(!this.$v.$invalid && this.$emit('ready')) || this.$emit('preventforward')
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
</style>
