<template>
  <section class="section vcenter">
    <div class="wrapper">
      <div class="columns is-centered">
        <div class="column is-10">
          <Card title="Talk to us!">
            <form @submit.prevent="onSubmit">
              <div class="columns">
                <div class="column is-half">
                  <div class="input-float">
                    <input-validation
                      ref="name"
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
                      ref="email"
                      v-model.trim="email"
                      label="Email"
                      field-name="email"
                      :validations="$options.validations.email"
                      :v="$v"
                      @blur="$v.email.$touch"
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
                      ref="fone"
                      v-model="$v.fone.$model"
                      label="Fone"
                      field-name="fone"
                      :validations="$options.validations.fone"
                      :v="$v"
                    >
                      <template #required>
                        Field is required
                      </template>
                      <template #minLength="{ min }">
                        Must have a {{ min }} chars minima
                      </template>
                      <template #pattern>
                        Use numbers or "+" only.
                      </template>
                      <template #message>
                        Use +[your country code here] if you need it
                      </template>
                    </input-validation>
                  </div>
                </div>
                <div class="column is-center is-half">
                  <input-validation
                    ref="msg"
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
                  <b-field>
                    <b-upload
                      v-model="files"
                      multiple
                      drag-drop
                      @input="onChoose"
                    >
                      <div class="content has-text-centered">
                        <p>
                          <b-icon icon="upload" size="is-small"></b-icon>
                        </p>
                        <p>Drop your files here or click to upload</p>
                      </div>
                    </b-upload>
                  </b-field>
                  <b-taglist>
                    <template v-for="(file, i) in files">
                      <b-tag
                        v-if="file"
                        :key="i"
                        style="margin:auto .5em"
                        attached
                        closable
                        aria-close-label="close tag"
                        @close="files.splice(i, 1)"
                      >
                        {{ abbreviate(file.name) }}
                      </b-tag>
                    </template>
                  </b-taglist>
                  <b-button
                    class="is-success"
                    :disabled="$v.$invalid || !validCaptcha"
                    rounded
                    native-type="submit"
                  >
                    Submit
                  </b-button>
                </div>
              </div>
            </form>
          </Card>
        </div>
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
      files: [],
      validCaptcha: true
    }
  },

  methods: {
    onSubmit() {
      this.$v.$touch()
      if (this.$v.$invalid) {
        const fields = Object.keys(this.$options.validations)
        for (const f of fields) {
          if (this.$v[f].$error) {
            this.$refs[f].focus()
            break
          }
        }
      }
      const formData = new FormData()
      formData.append('name', this.name)
      formData.append('email', this.email)
      formData.append('fone', this.fone)
      formData.append('msg', this.msg)
      for (const f of this.files) {
        formData.append('uploads', f, f.name)
      }
      this.$axios
        .post('/api/send', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then(res => {
          this.$buefy.toast.open({
            duration: 1000,
            message: 'Message sucessfully sent!'
          })
        })
        .catch(err => {
          console.log(err.response)
          this.$buefy.toast.open({
            duration: 1000,
            message: err.response.code
          })
        })
    },

    abbreviate(filename) {
      const grps = /^(.*)\.(.+)$/.exec(filename)
      return filename.length < 10
        ? filename
        : filename.substring(0, 3) + '...' + (grps ? '.' + grps[2] : '')
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
  align-items: flex-end;
  align-items: center;
  height: 90vh;
}

.wrapper {
  flex: 1 0 auto;
  margin: auto;
  height: 50vh;
}

.input-float {
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
</style>
