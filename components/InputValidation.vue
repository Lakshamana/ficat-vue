<template>
  <b-field :label="label">
    <b-input
      v-model="iptValue"
      type="text"
      :aria-required="!!$options.validations.required"
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
import { required, minLength } from 'vuelidate/lib/validators'
export default {
  name: 'InputValidation',
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

  validations: {
    authorName: {
      required,
      minLength: minLength(3)
    },
    authorSurname: {
      required,
      minLength: minLength(5)
    },
    author2Name: {
      minLength: minLength(3)
    },
    author2Surname: {
      minLength: minLength(5)
    }
  },

  computed: {
    iptValue() {
      return this.useModel ? this.$v[this.fieldName].$model : '' + this.value
    }
  }
}
</script>
