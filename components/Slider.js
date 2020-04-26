import '~/components/css/Slider.css'
import WithTooltip from '~/components/WithTooltip'

export default {
  name: 'Slider',
  components: {
    WithTooltip
  },
  data() {
    return {
      slideIndex: 0,
      disableNext: false
    }
  },
  methods: {
    incrementSlideIndex(n) {
      this.slideIndex += n
    },
    handleNext() {
      if (this.$refs.component.checkNext()) {
        this.incrementSlideIndex(1)
      }
    }
  },
  render() {
    const children = this.$slots.default.filter(c => c.tag && c.data)
    const Component =
      children[this.slideIndex].componentOptions.Ctor.extendOptions
    const next = this.$tr('layout.next')
    const previous = this.$tr('layout.previous')
    return (
      <div class="box-wrapper">
        {this.slideIndex > 0 && (
          <WithTooltip {...{ props: { text: previous } }}>
            <button
              tabindex="0"
              class="slider-control"
              aria-label={previous}
              onClick={() => this.incrementSlideIndex(-1)}
            >
              <span class="symbol">&laquo;</span>
            </button>
          </WithTooltip>
        )}
        <Component ref="component" />
        {this.slideIndex < children.length - 1 && (
          <WithTooltip {...{ props: { text: next } }}>
            <button
              tabindex="0"
              class="slider-control"
              aria-label={next}
              onClick={this.handleNext}
            >
              <span class="symbol">&raquo;</span>
            </button>
          </WithTooltip>
        )}
      </div>
    )
  }
}
