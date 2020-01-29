<template>
  <Card title="Authorship Data">
    <div class="columns">
      <div class="column is-half">
        <input-validation
          v-model="authorName"
          label="Author Name"
          field-name="authorName"
          :validators="$options.validations.authorName"
        ></input-validation>
        <input-validation
          v-model="authorSurname"
          label="Author Surname"
          field-name="authorSurname"
          :validators="$options.validations.authorSurname"
        ></input-validation>
      </div>
      <div class="column is-half">
        <input-validation
          v-model="authorSurname"
          label="Second Author Name"
          field-name="author2Name"
          :validators="$options.validations.author2Name"
        ></input-validation>
        <input-validation
          v-model="author2Surname"
          label="Second Author Surname"
          field-name="author2Surname"
          :validators="$options.validations.author2Surname"
        ></input-validation>
      </div>
    </div>
  </Card>
</template>

<script>
import Vue from 'vue'
import Vuelidate from 'vuelidate'

import { required, minLength } from 'vuelidate/lib/validators'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation'
Vue.use(Vuelidate)

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
