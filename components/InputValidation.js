import '~/components/css/InputValidation.css'

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
    },

    options: {
      type: Object,
      default: () => ({})
    },

    wrappedSlots: {
      type: Function,
      default: () => []
    }
  },

  computed: {
    iptValue: {
      get() {
        return this.useModel ? this.v[this.fieldName].$model : this.value
      },

      set() {
        const model = this.useModel ? this.v[this.fieldName].$model : this.value
        this.$set(this.v[this.fieldName], '$model', model)
      }
    }
  },

  render(h) {
    const {
      label,
      validations,
      useComponent: Component,
      v,
      fieldName,
      type
    } = this.$props

    const scopedSlots = Object.keys(validations).map(k => {
      if (!this.$scopedSlots[k]) return undefined
      return (
        !v[fieldName][k] &&
        v[fieldName].$error &&
        this.$scopedSlots[k](v[fieldName].$params[k])
      )
    })

    return (
      <div class="flex-div">
        <b-field label={label} label-position="on-border">
          {this.$slots.addon}
          <Component
            vModel={this.iptValue}
            aria-required={!!validations.required}
            aria-describedby="errormsg"
            aria-placeholder={label.toLowerCase()}
            rounded
            onInput={e => this.$emit('input', e)}
            type={type || 'text'}
            {...{ props: this.$props.options }}
            on={this.$listeners}
          >
            {this.$slots.component}
            {...this.$props.wrappedSlots(h)}
          </Component>
        </b-field>
        <span id="errormsg" aria-live="assertive" class="error">
          {scopedSlots}
        </span>
      </div>
    )
  }
}
