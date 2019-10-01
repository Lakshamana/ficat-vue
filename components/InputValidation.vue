<template>
  <b-field
    :label="properties.inputLabel || ''"
    :message="messageParams"
    :type="{
      [valid ? 'is-success' : 'is-danger']: dirty
    }"
  >
    <slot name="addon"></slot>
    <b-input
      ref="ipt"
      v-model="iptValue"
      :type="properties.type"
      :icon="properties.icon"
      :password-reveal="
        properties.type === 'password' && properties.passwordReveal
      "
      :placeholder="properties.placeholder"
      :aria-placeholder="ariaPlaceholder"
      :pattern="properties.pattern"
      :minlength="properties.minlength"
      :maxlength="properties.maxlength"
      :required="properties.required"
      :aria-required="properties.ariaRequired"
      :aria-errormessage="ariaErrorMessages"
      :rounded="properties.rounded"
      @blur="onBlur"
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
      iptValue: this.value
    }
  },

  computed: {
    messageParams() {
      const obj = {}
      this.properties.defaultMessage &&
        (obj[this.properties.defaultMessage] = true)
      if (this.dirty) {
        if (this.valid) {
          this.properties.validMessage &&
            (obj[this.properties.validMessage] = this.dirty)
        } else {
          for (const msg of this.properties.invalidMessages) {
            obj[msg] = this.dirty
          }
        }
      }
      return obj
    },

    ariaErrorMessages() {
      return (
        this.messageParams.invalidParams &&
        this.messageParams.invalidMessages.join(' ')
      )
    },

    ariaPlaceholder() {
      return this.properties.ariaPlaceholder || this.properties.placeholder
    },

    ariaRequired() {
      return this.properties.ariaRequired || this.properties.required
    },

    valid() {
      const ipt = this.$refs.ipt
      const val = this.iptValue
      return this.properties.valid
        ? this.properties.valid(val)
        : ipt && ipt.checkHtml5Validity()
    }
  },

  methods: {
    onChange(value) {
      this.$emit('input', value)
    },

    onBlur() {
      this.dirty = true
      this.$emit('blur')
    }
  }
}
</script>
