<template>
  <div class="flex-div">
    <b-field :label="label" label-position="on-border">
      <b-input
        v-model="iptValue"
        :type="type"
        :aria-required="!!validations.required"
        aria-describedby="errormsg"
        :aria-placeholder="label.toLowerCase()"
        rounded
        @input="$emit('input', $event)"
      ></b-input>
    </b-field>
    <span v-if="v[fieldName].$error" id="errormsg" class="error">
      <template v-for="(_, k) in validations">
        <slot
          v-if="!v[fieldName][k]"
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
    }
  },

  data() {
    return {
      iptValue: this.value
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
