<template>
  <b-field
    :label="properties.inputLabel || ''"
    :message="messageParams"
    :type="{
      [valid ? 'is-success' : 'is-danger']: dirty
    }"
  >
    <b-input
      ref="ipt"
      :value="value"
      :type="properties.type"
      :placeholder="properties.placeholder"
      :aria-placeholder="ariaPlaceholder"
      :pattern="properties.pattern"
      :minlength="properties.minlength"
      :maxlength="properties.maxlength"
      :required="properties.required"
      :aria-required="properties.ariaRequired"
      :rounded="properties.rounded"
      @blur="dirty = true"
      @input="onChange"
    ></b-input>
  </b-field>
</template>

<script>
export default {
  name: 'InputValidation',
  props: {
    properties: {
      type: Object,
      default: () => ({})
    },

    value: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      dirty: false,
      valid: false
    }
  },

  computed: {
    messageParams() {
      const obj = {}
      if (this.dirty) {
        if (this.valid) {
          this.properties.validMessage &&
            (obj[this.properties.validMessage] = this.dirty)
        } else {
          for (const msg of this.properties.invalidMessages) {
            obj[msg] = this.dirty
          }
        }
      } else {
        this.properties.defaultMessage &&
          (obj[this.properties.defaultMessage] = !this.dirty)
      }
      return obj
    },

    ariaPlaceholder() {
      return this.properties.ariaPlaceholder || this.properties.placeholder
    },

    ariaRequired() {
      return this.properties.ariaRequired || this.properties.required
    }
  },

  methods: {
    onChange(value) {
      this.$emit('input', value)
      this.$refs.ipt && (this.valid = this.$refs.ipt.checkHtml5Validity())
    }
  }
}
</script>
