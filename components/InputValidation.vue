<template>
  <div class="flex-div">
    <b-field :label="label" label-position="on-border">
      <slot name="addon"></slot>
      <component
        :is="useComponent"
        v-model="iptValue"
        :type="type"
        :aria-required="!!validations.required"
        aria-describedby="errormsg"
        :aria-placeholder="label.toLowerCase()"
        rounded
        @input="$emit('input', $event)"
      ></component>
    </b-field>
    <span id="errormsg" aria-live="assertive" class="error">
      <template v-for="(_, k) in validations">
        <slot
          v-if="!v[fieldName][k] && v[fieldName].$error"
          :name="k"
          :props="v[fieldName].$params[k]"
        ></slot>
      </template>
    </span>
  </div>
</template>

<script>
export default {
  name: 'InputValidation',
  props: {
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
    },

    validations: {
      type: Object,
      required: true
    },

    v: {
      type: Object,
      required: true
    },

    type: {
      type: String,
      default: 'text'
    },

    useComponent: {
      type: String,
      default: 'b-input'
    }
  },

  data() {
    return {
      inputVal: this.value
    }
  },

  computed: {
    iptValue: {
      get() {
        return this.useModel ? this.v[this.fieldName].$model : this.inputVal
      },

      set(val) {
        const model = this.useModel
          ? this.v[this.fieldName].$model
          : this.inputVal
        this.$set(this.v[this.fieldName], '$model', model)
      }
    }
  }
}
</script>

<style scoped>
.flex-div {
  flex: 0 1 auto;
  max-height: 100%;
}
</style>
