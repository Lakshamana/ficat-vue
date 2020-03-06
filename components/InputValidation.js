import '~/components/css/InputValidation.css'
import WithTooltip from '~/components/WithTooltip'

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

    tooltipLabel: {
      type: String,
      default: ''
    },

    useLabel: {
      type: Boolean,
      default: true
    },

    wrappedSlots: {
      type: Function,
      default: () => []
    }
  },

  components: {
    WithTooltip
  },

  computed: {
    iptValue: {
      get() {
        return this.useModel ? this.v[this.fieldName].$model : this.value
      },

      set() {}
    }
  },

  render(h) {
    const {
      label,
      validations,
      useComponent: Component,
      v,
      fieldName,
      type,
      tooltipLabel,
      options,
      useLabel = true
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
        <WithTooltip
          {...{
            props: {
              text: tooltipLabel
            }
          }}
        >
          <b-field
            {...(useLabel && { props: { label } })}
            label-position="on-border"
          >
            {this.$slots.addon}
            <Component
              vModel={this.iptValue}
              aria-label={tooltipLabel}
              aria-required={!!validations.required}
              aria-describedby="errormsg"
              aria-placeholder={label.toLowerCase()}
              rounded
              expanded
              onInput={e => this.$emit('input', e)}
              type={type || 'text'}
              {...{ props: options }}
              on={this.$listeners}
            >
              {this.$slots.component}
              {...this.$props.wrappedSlots(h)}
            </Component>
          </b-field>
        </WithTooltip>
        {this.$slots.message && (
          <div class="optional" aria-live="assertive">
            {this.$slots.message}
          </div>
        )}
        {!validations.required && !validations.$invalid ? (
          <div class="optional" aria-live="assertive">
            Optional field
          </div>
        ) : (
          <span id="errormsg" aria-live="assertive" class="error">
            {scopedSlots}
          </span>
        )}
      </div>
    )
  }
}
