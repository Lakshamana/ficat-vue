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
            tooltip-label="Type in your work's advisor name"
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
            label="Advisor Surname"
            field-name="advisorSurname"
            :validations="$options.validations.advisorSurname"
            :v="$v"
            type="text"
            tooltip-label="Type in your work's advisor surname"
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
              <div class="vcenter">
                <WithTooltip text="Check if is your advisor a woman">
                  <b-checkbox v-model="isFemaleAdvisor">
                    Female
                  </b-checkbox>
                </WithTooltip>
              </div>
            </div>
            <div class="column is-half">
              <input-validation
                v-model="$v.advisorTitle.$model"
                label="Advisor Title"
                field-name="advisorTitle"
                :validations="$options.validations.advisorTitle"
                :v="$v"
                use-component="b-select"
                tooltip-label="Select the advisor's title"
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
            tooltip-label="Type in your work's coadvisor name"
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
            tooltip-label="Type in your work's coadvisor surname"
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
              <div class="vcenter">
                <WithTooltip text="Check if is your coadvisor a woman">
                  <b-checkbox
                    v-model="isFemaleCoadvisor"
                    :disabled="!coadvisorName"
                  >
                    Female
                  </b-checkbox>
                </WithTooltip>
              </div>
            </div>
            <div class="column is-half">
              <input-validation
                v-model="$v.coadvisorTitle.$model"
                label="Coadvisor Title"
                field-name="coadvisorTitle"
                :validations="$options.validations.coadvisorTitle"
                :v="$v"
                use-component="b-select"
                tooltip-label="Select the coadvisor's title"
                :disabled="!coadvisorName"
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
import { recovery, replace } from '~/front/persistence'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation.js'
import WithTooltip from '~/components/WithTooltip'

export default {
  name: 'AuthorshipForm',
  components: { Card, InputValidation, WithTooltip },
  data() {
    const { advisors } = recovery('form')
    return {
      advisorName: advisors.advisorName,
      advisorSurname: advisors.advisorSurname,
      coadvisorName: advisors.coadvisorName,
      coadvisorSurname: advisors.coadvisorSurname,
      isFemaleAdvisor: advisors.isFemaleAdvisor,
      advisorTitle: advisors.advisorTitle,
      coadvisorTitle: advisors.coadvisorTitle,
      isFemaleCoadvisor: advisors.isFemaleCoadvisor
    }
  },

  watch: {
    $v: {
      deep: true,
      handler($v) {
        replace('form', { advisors: { ...this.$data } })
        ;(!$v.$invalid && this.$emit('ready')) || this.$emit('preventforward')
      }
    }
  },

  mounted() {
    ;(!this.$v.$invalid && this.$emit('ready')) || this.$emit('preventforward')
  },

  beforeCreate() {
    if (!recovery('form').advisors)
      replace('form', {
        advisors: {
          advisorName: '',
          advisorSurname: '',
          coadvisorName: '',
          coadvisorSurname: '',
          isFemaleAdvisor: false,
          advisorTitle: 'doctor',
          coadvisorTitle: 'doctor',
          isFemaleCoadvisor: false
        }
      })
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

.vcenter {
  align-items: center;
}

.field {
  position: relative;
  top: -1rem;
}
</style>
