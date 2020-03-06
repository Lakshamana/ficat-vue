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
      disableNext: true
    }
  },
  methods: {
    incrementSlideIndex(n) {
      this.slideIndex += n
    }
  },
  render() {
    const children = this.$slots.default.filter(c => c.tag && c.data)
    const Component =
      children[this.slideIndex].componentOptions.Ctor.extendOptions
    return (
      <div class="box-wrapper">
        {this.slideIndex > 0 && (
          <WithTooltip {...{ props: { text: 'Go to previous slide' } }}>
            <button
              tabindex="0"
              class="slider-control"
              aria-label="previous"
              onClick={() => this.incrementSlideIndex(-1)}
            >
              <span class="symbol">&lt;</span>
            </button>
          </WithTooltip>
        )}
        <Component
          on-ready={() => (this.disableNext = false)}
          on-preventforward={() => (this.disableNext = true)}
        />
        {this.slideIndex < children.length - 1 && (
          <WithTooltip {...{ props: { text: 'Go to next slide' } }}>
            <button
              tabindex="0"
              class="slider-control"
              aria-label="next"
              onClick={() => this.incrementSlideIndex(1)}
              disabled={this.disableNext}
            >
              <span class="symbol">&gt;</span>
            </button>
          </WithTooltip>
        )}
      </div>
    )
  }
}
