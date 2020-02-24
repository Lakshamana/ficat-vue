<template>
  <section class="section vcenter">
    <div class="columns is-centered">
      <div class="column is-10">
        <Card title="Talk to us!">
          <div class="columns">
            <div class="column is-half">
              <div class="input-float">
                <input-validation
                  v-model="$v.name.$model"
                  label="Name"
                  field-name="name"
                  :validations="$options.validations.name"
                  :v="$v"
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
                  v-model="email"
                  label="Email"
                  field-name="email"
                  :validations="$options.validations.email"
                  :v="$v"
                  :use-model="false"
                >
                  <template #required>
                    Field is required
                  </template>
                  <template #minLength="{ min }">
                    Must have a {{ min }} chars minima
                  </template>
                  <template #email>
                    It doesn't look like a valid email.
                  </template>
                </input-validation>
                <input-validation
                  v-model="$v.fone.$model"
                  label="Fone"
                  field-name="fone"
                  :validations="$options.validations.fone"
                  :v="$v"
                  type="text"
                >
                  <template #required>
                    Field is required
                  </template>
                  <template #minLength="{ min }">
                    Must have a {{ min }} chars minima
                  </template>
                  <template #optional>
                    Use +[your country code here] if you need it
                  </template>
                </input-validation>
              </div>
            </div>
            <div class="column is-half">
              <div class="input-float">
                <input-validation
                  v-model="$v.msg.$model"
                  label="Message"
                  field-name="msg"
                  :validations="$options.validations.msg"
                  :v="$v"
                  type="textarea"
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
      </div>
    </div>
  </section>
</template>

<script>
import { required, minLength, maxLength, email } from 'vuelidate/lib/validators'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation.js'

export default {
  name: 'AuthorshipForm',
  components: { Card, InputValidation },
  data() {
    return {
      name: '',
      email: '',
      fone: '',
      msg: '',
      file: undefined,
      validCaptcha: false
    }
  },

  methods: {
    filterModels() {
      return Object.keys(this.$v).filter(k => !k.startsWith('$'))
    }
  },

  validations: {
    name: {
      required,
      minLength: minLength(7)
    },
    email: {
      required,
      email,
      minLength: minLength(7)
    },
    fone: {
      required,
      pattern: val => /^\+?[0-9]+$/.test(val),
      minLength: minLength(3)
    },
    msg: {
      required,
      minLength: minLength(20),
      maxLength: maxLength(140)
    }
  }
}
</script>

<style scoped>
.vcenter {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.columns {
  flex: 1 0 auto;
  height: 30vh;
  margin: auto;
}

.input-float {
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
</style>
