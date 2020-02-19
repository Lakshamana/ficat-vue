<template>
  <section class="hero has-background-grey-light is-fullheight">
    <div class="columns is-centered">
      <div class="column is-5">
        <section class="section">
          <form @submit.prevent="onSubmit">
            <Card>
              <section class="section">
                <div class="centered-image">
                  <figure class="image is-32x32 is-inline-block">
                    <img src="~/assets/favicon.png" alt="FICAT Logo" />
                  </figure>
                </div>
                <input-validation
                  v-model="$v.username.$model"
                  label="Username"
                  field-name="username"
                  :validations="$options.validations.username"
                  :v="$v"
                >
                  <template #required>
                    Field is required
                  </template>
                  <template #minLength="{ min }">
                    Must have a {{ min }} chars minima
                  </template>
                </input-validation>
                <input-validation
                  v-model="$v.username.$model"
                  label="Username"
                  field-name="username"
                  :validations="$options.validations.username"
                  :v="$v"
                  type="password"
                  :options="{
                    expanded: true,
                    passwordReveal: true
                  }"
                >
                  <template #required>
                    Field is required
                  </template>
                  <template #minLength="{ min }">
                    Must have a {{ min }} chars minima
                  </template>
                </input-validation>
                <div class="level">
                  <div class="level-left"></div>
                  <div class="field level-right">
                    <b-checkbox v-model="rememberMe" class="is-small">
                      Lembrar de mim
                    </b-checkbox>
                  </div>
                </div>
                <b-button class="is-info" native-type="submit">Login</b-button>
              </section>
            </Card>
          </form>
        </section>
      </div>
    </div>
  </section>
</template>

<script>
import Card from '@/components/Card'
import InputValidation from '@/components/InputValidation.js'
const pattern = '[a-zA-Z\u00C0-\u017F]'

export default {
  name: 'Login',
  layout: 'empty',

  components: {
    Card,
    InputValidation
  },

  data() {
    return {
      username: '',
      password: '',
      rememberMe: false,
      usernameProperties: {
        placeholder: 'Nome de usuário',
        invalidMessages: [
          'Campo obrigatório e mínimo de 5 caracteres. Digite letras apenas'
        ],
        pattern: `${pattern}+`,
        minlength: 5,
        required: true,
        rounded: true
      },
      passwordProperties: {
        type: 'password',
        placeholder: 'Senha',
        invalidMessages: [
          'Campo obrigatório e mínimo de 5 caracteres. Digite letras apenas'
        ],
        pattern: `${pattern}+`,
        minlength: 5,
        required: true,
        rounded: true,
        passwordReveal: true
      }
    }
  },

  methods: {
    onSubmit() {
      // eslint-disable-next-line no-debugger
      // debugger
      this.$axios
        .post('/api/auth', {
          username: this.username,
          password: this.password,
          rememberMe: this.rememberMe
        })
        .then(response => {
          this.$store.dispatch('auth/login', {
            username: this.username,
            xsrfToken: this.$cookies.get('xsrfToken')
          })
          const to = this.$route.query.to ? atob(this.$route.query.to) : '/'
          this.$router.push(to)
        })
    }
  }
}
</script>

<style scoped>
.mb {
  margin-bottom: 2.1em;
}

.centered-image {
  margin: 10px auto;
}
</style>
