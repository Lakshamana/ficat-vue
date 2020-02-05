import '~/components/css/Slider.css'

export default {
  name: 'Slider',
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
          <button
            tabindex="0"
            class="slider-control"
            aria-label="previous"
            onClick={() => this.incrementSlideIndex(-1)}
          >
            <span class="symbol">&lt;</span>
          </button>
        )}
        <Component
          on-ready={() => (this.disableNext = false)}
          on-preventforward={() => (this.disableNext = true)}
        />
        {this.slideIndex < children.length - 1 && (
          <button
            tabindex="0"
            class="slider-control"
            aria-label="next"
            onClick={() => this.incrementSlideIndex(1)}
            disabled={this.disableNext}
          >
            <span class="symbol">&gt;</span>
          </button>
        )}
      </div>
    )
  }
}
