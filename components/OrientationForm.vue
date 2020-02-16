<template>
  <Card title="Orientation Data">
    <div class="columns">
      <div class="column is-half">
        <div class="input-float">
          <input-validation
            v-model="$v.advisorName.$model"
            label="Advisor Name"
            field-name="advisorName"
            :validations="$options.validations.advisorName"
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
            v-model="$v.advisorSurname.$model"
            label="Author Surname"
            field-name="advisorSurname"
            :validations="$options.validations.advisorSurname"
            :v="$v"
            type="text"
          >
            <template #required>
              Field is required
            </template>
            <template #minLength="{ min }">
              Must have a {{ min }} chars minima
            </template>
          </input-validation>
          <div class="columns vcenter">
            <div class="column is-half">
              <b-field class="field">
                <b-checkbox v-model="isFemaleAdvisor">
                  Orientadora
                </b-checkbox>
              </b-field>
            </div>
            <div class="column is-half">
              <input-validation
                v-model="$v.advisorTitle.$model"
                label="Advisor Title"
                field-name="advisorTitle"
                :validations="$options.validations.advisorTitle"
                :v="$v"
                use-component="b-select"
                :options="{
                  expanded: true
                }"
              >
                <template #component>
                  <option value="graduate">Graduado</option>
                  <option value="expert">Especialista</option>
                  <option value="master">Mestre</option>
                  <option value="doctor">Doutor</option>
                </template>
                <template #required>
                  Field is required
                </template>
              </input-validation>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="input-float">
          <input-validation
            v-model="$v.coadvisorName.$model"
            label="Coadvisor Name"
            field-name="coadvisorName"
            :validations="$options.validations.coadvisorName"
            :v="$v"
            type="text"
          >
            <template #required>
              Field is required
            </template>
            <template #minLength="{ min }">
              Must have a {{ min }} chars minima
            </template>
          </input-validation>
          <input-validation
            v-model="$v.coadvisorSurname.$model"
            label="Coadvisor Surname"
            field-name="coadvisorSurname"
            :validations="$options.validations.coadvisorSurname"
            :v="$v"
            type="text"
          >
            <template #required>
              Field is required
            </template>
            <template #minLength="{ min }">
              Must have a {{ min }} chars minima
            </template>
          </input-validation>
          <div class="columns vcenter">
            <div class="column is-half">
              <b-field class="field">
                <b-checkbox v-model="isFemaleCoadvisor">
                  Orientadora
                </b-checkbox>
              </b-field>
            </div>
            <div class="column is-half">
              <input-validation
                v-model="$v.coadvisorTitle.$model"
                label="Coadvisor Title"
                field-name="coadvisorTitle"
                :validations="$options.validations.coadvisorTitle"
                :v="$v"
                use-component="b-select"
                :options="{
                  expanded: true
                }"
              >
                <template #component>
                  <option value="graduate">Graduado</option>
                  <option value="expert">Especialista</option>
                  <option value="master">Mestre</option>
                  <option value="doctor">Doutor</option>
                </template>
                <template #required>
                  Field is required
                </template>
              </input-validation>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation.js'

export default {
  name: 'AuthorshipForm',
  components: { Card, InputValidation },
  data() {
    return {
      advisorName: '',
      advisorSurname: '',
      coadvisorName: '',
      coadvisorSurname: '',
      isFemaleAdvisor: false,
      advisorTitle: 'doctor',
      coadvisorTitle: 'doctor',
      isFemaleCoadvisor: false
    }
  },

  watch: {
    $v: {
      deep: true,
      handler($v) {
        if (!$v.$invalid) {
          this.$emit('ready')
          this.$store.dispatch('form/save', {
            data: this.$data,
            index: 'advisors'
          })
        } else this.$emit('preventforward')
      }
    }
  },

  methods: {
    filterModels() {
      return Object.keys(this.$v).filter(k => !k.startsWith('$'))
    }
  },

  validations: {
    advisorName: {
      required,
      minLength: minLength(3)
    },
    advisorSurname: {
      required,
      minLength: minLength(5)
    },
    coadvisorName: {
      minLength: minLength(3)
    },
    coadvisorSurname: {
      minLength: minLength(5)
    },
    advisorTitle: {
      required
    },
    coadvisorTitle: {
      required
    }
  }
}
</script>

<style scoped>
.input-float {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.columns {
  height: 30vh;
}

.vcenter {
  align-items: center;
}

.field {
  position: relative;
  top: -1rem;
}
</style>
