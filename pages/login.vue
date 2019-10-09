<template>
  <section class="hero has-background-grey-light is-fullheight">
    <div class="columns is-centered">
      <div class="column is-5">
        <section class="section">
          <form @submit.prevent="onSubmit">
            <card>
              <section class="section">
                <div class="centered-image">
                  <figure class="image is-32x32 is-inline-block">
                    <img src="~/assets/favicon.png" alt="FICAT Logo" />
                  </figure>
                </div>
                <input-validation
                  v-model="username"
                  :properties="usernameProperties"
                ></input-validation>
                <input-validation
                  v-model="password"
                  :properties="passwordProperties"
                ></input-validation>
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
            </card>
          </form>
        </section>
      </div>
    </div>
  </section>
</template>

<script>
// import { decode } from '@/shared/frontUtils'
import Card from '@/components/Card'
import InputValidation from '@/components/InputValidation'
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
          'Campo obrigatório e mínimo de 3 caracteres. Digite letras apenas'
        ],
        pattern: `${pattern}+`,
        minlength: 3,
        required: true,
        rounded: true
      },
      passwordProperties: {
        type: 'password',
        placeholder: 'Senha',
        invalidMessages: [
          'Campo obrigatório e mínimo de 8 caracteres. Digite letras apenas'
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
      this.$axios
        .post('/api/auth', {
          username: this.username,
          password: this.password,
          rememberMe: this.rememberMe
        })
        .then(({ data }) => {
          this.$store.dispatch('auth/login', this.username)
          this.$router.push(atob(this.$route.query.to))
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
