<template>
  <Card title="Authorship Data">
    <div class="columns">
      <div class="column is-half">
        <input-validation
          v-model="$v.authorName.$model"
          label="Author Name"
          field-name="authorName"
          :validations="$options.validations.authorName"
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
          v-model="$v.authorSurname.$model"
          label="Author Name"
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
        <input-validation
          v-model="$v.author2Name.$model"
          label="Author Name"
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
          label="Author Name"
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
  </Card>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation'

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
