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
      v-model="properties.model"
      :type="properties.type"
      :placeholder="properties.placeholder"
      :aria-placeholder="properties.ariaPlaceholder"
      :pattern="properties.pattern"
      :minlength="properties.minlength"
      :maxlength="properties.maxlength"
      :required="properties.required"
      :aria-required="properties.ariaRequired"
      :rounded="properties.rounded"
      @blur="dirty = true"
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
    }
  },

  data() {
    return {
      dirty: false
    }
  },

  computed: {
    messageParams() {
      const obj = {}
      if (this.dirty) {
        if (this.valid) {
          obj[this.properties.validMessage] = this.dirty
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

    valid() {
      return this.$refs.ipt && this.$refs.ipt.checkHtml5Validity()
    },

    value() {
      return this.$refs.ipt && this.$refs.ipt.nodeValue
    }
  }
}
</script>
