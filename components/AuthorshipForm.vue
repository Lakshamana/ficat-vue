<template>
  <Card title="Authorship Data">
    <div class="columns">
      <div class="column is-half">
        <b-field label="Author Name">
          <b-input
            v-model="$v.authorName.$model"
            type="text"
            aria-required="true"
            required
            minlength="3"
            placeholder="Author Name"
            aria-placeholder="author name"
          ></b-input>
          <div v-if="$v.authorName.$error" class="error">
            This field is required
          </div>
        </b-field>
        <input-validation
          v-model="authorSurname"
          :properties="authorSurnameProperties"
        ></input-validation>
      </div>
      <div class="column is-half">
        <input-validation
          v-model="author2Name"
          :properties="author2NameProperties"
        ></input-validation>
        <input-validation
          v-model="author2Surname"
          :properties="author2SurnameProperties"
        ></input-validation>
      </div>
    </div>
  </Card>
</template>

<script>
import { required, minLength } from 'vuelidate'
import Card from '~/components/Card'
export default {
  name: 'AuthorshipForm',
  components: { Card },
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

<style></style>
