<template>
  <Card title="Authorship Data">
    <div class="columns">
      <div class="column is-half">
        <input-validation
          v-model="authorName"
          label="Author Name"
          field-name="authorName"
          :validations="$options.validations.authorName"
        ></input-validation>
        <input-validation
          v-model="authorSurname"
          label="Author Surname"
          field-name="authorSurname"
          :validations="$options.validations.authorSurname"
        ></input-validation>
      </div>
      <div class="column is-half">
        <input-validation
          v-model="authorSurname"
          label="Second Author Name"
          field-name="author2Name"
          :validations="$options.validations.author2Name"
        ></input-validation>
        <input-validation
          v-model="author2Surname"
          label="Second Author Surname"
          field-name="author2Surname"
          :validations="$options.validations.author2Surname"
        ></input-validation>
      </div>
    </div>
  </Card>
</template>

<script>
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
  }
}
</script>
