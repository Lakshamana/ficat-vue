<template>
  <Card title="Authorship Data">
    <div class="columns">
      <div class="column is-half">
        <input-validation
          v-model="authorName"
          :properties="authorNameProperties"
          class="mb"
        ></input-validation>
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
  }
}
</script>

<style></style>
