<template>
  <card title="Keywords">
    <div class="columns is-centered">
      <div class="column is-half">
        <div
          v-for="(kw, i) in $v.keywords.$each.$iter"
          :key="i"
          class="field is-grouped is-grouped"
        >
          <input-validation
            v-model="kw.text.$model"
            :label="'Keyword ' + (+i + 1)"
            field-name="text"
            :validations="kw.text"
            :v="kw"
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
          <div class="btn-block">
            <b-button
              icon-right="plus"
              class="is-success is-round is-outlined btn"
              :disabled="keywords.length > 4"
              @click="keywords.push({ text: '' })"
            ></b-button>
            <b-button
              v-if="i > 0"
              icon-right="minus"
              class="is-danger is-round btn-margin is-outlined btn"
              @click="keywords.splice(i, 1)"
            ></b-button>
          </div>
        </div>
      </div>
    </div>
  </card>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation.js'
export default {
  name: 'KeywordForm',
  components: { Card, InputValidation },
  data() {
    return {
      keywords: [{ text: '' }]
    }
  },
  validations: {
    keywords: {
      required,
      minLength: minLength(1),
      $each: {
        text: {
          required,
          minLength: minLength(5)
        }
      }
    }
  }
}
</script>

<style>
.btn-block {
  display: flex;
  justify-content: space-between;
}

.btn {
  flex: 0 1 auto;
  margin: 0 0.3em;
  border-radius: 50%;
}
</style>
