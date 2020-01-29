<template>
  <b-field :label="label">
    <b-input
      v-model="iptValue"
      type="text"
      :aria-required="!!validations.required"
      aria-describedby="errormsg"
      :placeholder="label"
      :aria-placeholder="label.toLowerCase()"
      @input="emit('input', $event.target.value)"
    ></b-input>
    <div v-if="$v[fieldName].$error" id="errormsg" class="error">
      <template v-for="v in validations">
        <slot
          v-if="!$v[fieldName][v]"
          :name="v"
          :props="$v[fieldName].$params[v]"
        ></slot>
      </template>
    </div>
  </b-field>
</template>

<script>
import { validationMixin } from 'vuelidate'
export default {
  name: 'InputValidation',
  mixins: [validationMixin],
  props: {
    validations: {
      type: Object,
      default: () => ({})
    },

    fieldName: {
      type: String,
      default: 'field'
    },

    label: {
      type: String,
      default: 'field'
    },

    value: {
      type: String,
      default: ''
    },

    useModel: {
      type: Boolean,
      default: true
    }
  },

  computed: {
    iptValue() {
      return this.useModel ? this.$v[this.fieldName].$model : '' + this.value
    }
  }
}
</script>
