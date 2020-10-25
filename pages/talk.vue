<template>
  <section class="section vcenter">
    <div class="wrapper">
      <div class="columns is-centered">
        <div class="column is-10">
          <Card :title="$tr('layout.talkToUs')">
            <form @submit.prevent="onSubmit">
              <div class="columns">
                <div class="column is-half">
                  <div class="input-float">
                    <input-validation
                      ref="name"
                      v-model="$v.name.$model"
                      :validations="$options.validations.name"
                      :v="$v"
                      :label="$tr('layout.talkFormName')"
                      :tooltip-label="$tr('layout.talkFormNameTooltip')"
                      field-name="name"
                    >
                      <template #required>
                        {{ $tr('layout.required') }}
                      </template>
                      <template #minLength="{ min }">
                        {{ $tr('layout.minLength', [min]) }}
                      </template>
                    </input-validation>
                    <input-validation
                      ref="email"
                      v-model.trim="email"
                      :validations="$options.validations.email"
                      :v="$v"
                      :label="$tr('layout.talkFormEmail')"
                      :tooltip-label="$tr('layout.talkFormEmailTooltip')"
                      @blur="$v.email.$touch"
                      field-name="email"
                    >
                      <template #required>
                        {{ $tr('layout.required') }}
                      </template>
                      <template #minLength="{ min }">
                        {{ $tr('layout.minLength', [min]) }}
                      </template>
                      <template #email>
                        {{ $tr('layout.invalidEmail') }}
                      </template>
                    </input-validation>
                    <input-validation
                      ref="fone"
                      v-model="$v.fone.$model"
                      :validations="$options.validations.fone"
                      :v="$v"
                      :label="$tr('layout.talkFormPhone')"
                      :tooltip-label="$tr('layout.talkFormPhoneTooltip')"
                      field-name="fone"
                    >
                      <template #required>
                        {{ $tr('layout.required') }}
                      </template>
                      <template #minLength="{ min }">
                        {{ $tr('layout.minLength', [min]) }}
                      </template>
                      <template #pattern>
                        {{ $tr('layout.numbersOnly') }}
                      </template>
                      <template #message>
                        {{ $tr('layout.internationalNumber') }}
                      </template>
                    </input-validation>
                  </div>
                </div>
                <div class="column is-center is-half">
                  <input-validation
                    ref="msg"
                    v-model="$v.msg.$model"
                    :validations="$options.validations.msg"
                    :v="$v"
                    :label="$tr('layout.talkFormMessage')"
                    :tooltip-label="$tr('layout.talkFormMessageTooltip')"
                    field-name="msg"
                    type="textarea"
                  >
                    <template #required>
                      {{ $tr('layout.required') }}
                    </template>
                    <template #minLength="{ min }">
                      {{ $tr('layout.minLength', [min]) }}
                    </template>
                  </input-validation>
                  <b-field>
                    <WithTooltip :text="$tr('layout.talkFormUploadTooltip')">
                      <b-upload v-model="files" multiple drag-drop>
                        <div class="content has-text-centered">
                          <p>
                            <b-icon icon="upload" size="is-small"></b-icon>
                          </p>
                          <p>{{ $tr('layout.talkFormUpload') }}</p>
                        </div>
                      </b-upload>
                    </WithTooltip>
                  </b-field>
                  <b-taglist>
                    <template v-for="(file, i) in files">
                      <b-tag
                        v-if="file"
                        :key="i"
                        @close="files.splice(i, 1)"
                        class="with-margin"
                        attached
                        closable
                        aria-close-label="close tag"
                      >
                        {{ abbreviate(file.name) }}
                      </b-tag>
                    </template>
                  </b-taglist>
                  <div class="flex-submit">
                    <WithTooltip :text="$tr('layout.solveCaptcha')">
                      <div style="margin:auto">
                        <recaptcha
                          @success="onSuccess"
                          @error="onSomeError('error')"
                          @expired="onSomeError('exp')"
                        />
                      </div>
                    </WithTooltip>
                    <WithTooltip :text="$tr('layout.submitBtnTooltip')">
                      <b-button
                        :disabled="disabled"
                        :loading="loading"
                        class="is-success"
                        rounded
                        native-type="submit"
                      >
                        {{ $tr('layout.submitBtn') }}
                      </b-button>
                    </WithTooltip>
                  </div>
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
import handler from '@/mixins/handler'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation.js'
import WithTooltip from '~/components/WithTooltip'

const defaultData = () => ({
  name: '',
  email: '',
  fone: '',
  msg: '',
  files: [],
  touchedCaptcha: false,
  captchaHasError: false,
  captchaHasExpired: false,
  loading: false
})

export default {
  name: 'Talk',
  components: { Card, InputValidation, WithTooltip },
  mixins: [handler],
  data() {
    return defaultData()
  },

  computed: {
    disabled() {
      return (
        this.$v.$invalid ||
        !this.touchedCaptcha ||
        this.captchaHasError ||
        this.captchaHasExpired
      )
    }
  },

  methods: {
    async onSubmit() {
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
      this.loading = true

      // Resolver captcha
      const token = await this.$recaptcha.getResponse()
      const res = await this.$axios.get('/api/captcha', {
        params: {
          token
        }
      })

      if (!res) return

      // Construir formulário para o envio do emails
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
        .then(async res => {
          this.$buefy.toast.open({
            duration: 1000,
            message: 'Message sucessfully sent!',
            type: 'is-success'
          })
          await this.resetState()
        })
        .catch(this.handle)
    },

    abbreviate(filename) {
      const grps = /^(.*)\.(.+)$/.exec(filename)
      return filename.length < 10
        ? filename
        : filename.substring(0, 3) + '...' + (grps ? '.' + grps[2] : '')
    },

    async resetState() {
      Object.assign(this.$data, defaultData())
      this.$v.$reset()
      await this.$recaptcha.reset()
    },

    onSomeError(type) {
      const data = type === 'exp' ? 'captchaHasExpired' : 'captchaHasError'
      this.$set(this.$data, data, true)
    },

    onSuccess() {
      this.touchedCaptcha = true
      this.captchaHasError = false
      this.captchaHasExpired = false
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
  align-items: center;
  align-items: center;
}

.wrapper {
  flex: 1 0 auto;
  margin: auto;
}

.input-float {
  margin: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.with-margin {
  margin: auto 0.5em;
}

.flex-submit {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 0.5em;
}
</style>
