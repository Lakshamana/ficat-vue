<template>
  <Card :title="$tr('layout.orientationData')">
    <div class="columns">
      <div class="column is-half">
        <div class="input-float">
          <input-validation
            ref="advisorName"
            v-model="$v.advisorName.$model"
            :validations="$options.validations.advisorName"
            :v="$v"
            :label="$tr('layout.whosName', ['advisor'])"
            :tooltip-label="$tr('layout.nameTooltip', ['lowAdvisor'])"
            field-name="advisorName"
          >
            <template #required>
              {{ $tr('layout.required') }}
            </template>
            <template #minLength="{ min }">
              {{ $tr('layout.minLength', [min]) }}
            </template>
          </input-validation>
          <input-validation
            ref="advisorSurname"
            v-model="$v.advisorSurname.$model"
            :validations="$options.validations.advisorSurname"
            :v="$v"
            :label="$tr('layout.whosSurname', ['advisor'])"
            :tooltip-label="$tr('layout.surnameTooltip', ['lowAdvisor'])"
            field-name="advisorSurname"
            type="text"
          >
            <template #required>
              {{ $tr('layout.required') }}
            </template>
            <template #minLength="{ min }">
              {{ $tr('layout.minLength', [min]) }}
            </template>
          </input-validation>
          <div class="columns vcenter">
            <div class="column is-half">
              <div class="vcenter">
                <WithTooltip
                  :text="$tr('layout.whosFemaleTooltip', ['lowAdvisor'])"
                >
                  <b-checkbox v-model="isFemaleAdvisor">
                    {{ $tr('layout.femaleAdvisor') }}
                  </b-checkbox>
                </WithTooltip>
              </div>
            </div>
            <div class="column is-half">
              <input-validation
                ref="advisorTitle"
                v-model="$v.advisorTitle.$model"
                :validations="$options.validations.advisorTitle"
                :v="$v"
                :label="$tr('layout.title')"
                :tooltip-label="$tr('layout.whosTitle', ['lowCoadvisor'])"
                field-name="advisorTitle"
                use-component="b-select"
              >
                <template #component>
                  <option value="graduate">{{ $tr('layout.graduate') }}</option>
                  <option value="expert">{{ $tr('layout.expert') }}</option>
                  <option value="master">{{ $tr('layout.master') }}</option>
                  <option value="doctor">{{ $tr('layout.doctor') }}</option>
                </template>
                <template #required>
                  {{ $tr('layout.required') }}
                </template>
              </input-validation>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-half">
        <div class="input-float">
          <input-validation
            ref="coadvisorName"
            v-model="$v.coadvisorName.$model"
            :validations="$options.validations.coadvisorName"
            :v="$v"
            :label="$tr('layout.whosName', ['coadvisor'])"
            :tooltip-label="$tr('layout.nameTooltip', ['lowCoadvisor'])"
            field-name="coadvisorName"
            type="text"
          >
            <template #required>
              {{ $tr('layout.required') }}
            </template>
            <template #minLength="{ min }">
              {{ $tr('layout.minLength', [min]) }}
            </template>
          </input-validation>
          <input-validation
            ref="coadvisorSurname"
            v-model="$v.coadvisorSurname.$model"
            :validations="$options.validations.coadvisorSurname"
            :v="$v"
            :label="$tr('layout.whosSurname', ['coadvisor'])"
            :tooltip-label="$tr('layout.surnameTooltip', ['lowCoadvisor'])"
            field-name="coadvisorSurname"
            type="text"
          >
            <template #required>
              {{ $tr('layout.required') }}
            </template>
            <template #minLength="{ min }">
              {{ $tr('layout.minLength', [min]) }}
            </template>
          </input-validation>
          <div class="columns vcenter">
            <div class="column is-half">
              <div class="vcenter">
                <WithTooltip
                  :text="$tr('layout.whosFemaleTooltip', ['lowCoadvisor'])"
                >
                  <b-checkbox
                    v-model="isFemaleCoadvisor"
                    :disabled="!coadvisorName"
                  >
                    {{ $tr('layout.femaleCoadvisor') }}
                  </b-checkbox>
                </WithTooltip>
              </div>
            </div>
            <div class="column is-half">
              <input-validation
                ref="coadvisorTitle"
                v-model="$v.coadvisorTitle.$model"
                :validations="$options.validations.coadvisorTitle"
                :v="$v"
                :disabled="!coadvisorName"
                :label="$tr('layout.title')"
                :tooltip-label="$tr('layout.whosTitle', ['lowCoadvisor'])"
                field-name="coadvisorTitle"
                use-component="b-select"
              >
                <template #component>
                  <option value="graduate">{{ $tr('layout.graduate') }}</option>
                  <option value="expert">{{ $tr('layout.expert') }}</option>
                  <option value="master">{{ $tr('layout.master') }}</option>
                  <option value="doctor">{{ $tr('layout.doctor') }}</option>
                </template>
                <template #required>
                  {{ $tr('layout.required') }}
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
import helper from '~/mixins/helper'
import { recovery, replace } from '~/front/persistence'
import Card from '~/components/Card'
import InputValidation from '~/components/InputValidation.js'
import WithTooltip from '~/components/WithTooltip'

export default {
  name: 'AuthorshipForm',
  components: { Card, InputValidation, WithTooltip },
  mixins: [helper],
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
        replace('form', { advisors: this.$data })
      }
    }
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
