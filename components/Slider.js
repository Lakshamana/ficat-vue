import '~/components/css/Slider.css'

export default {
  name: 'Slider',
  // props: {
  //   preventForward: {
  //     type: Boolean,
  //     default: true
  //   }
  // },
  data() {
    return {
      slideIndex: 0,
      disableNext: true
    }
  },
  methods: {
    incrementSlideIndex(n) {
      this.slideIndex += n
    },
    toggleForward() {
      console.log(this.preventForward)
      this.preventForward = !this.preventForward
    }
  },
  render(h) {
    const normalizedChildren = this.$slots.default.filter(c => c.tag)
    for (const child of normalizedChildren) {
      child.data.on = {
        ready: () => console.log('ready'),
        preventForward: () => (this.disableNext = true)
      }
    }
    const Component = normalizedChildren[this.slideIndex]
    console.log(normalizedChildren)
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
        {/* <Component onClick={(this.disableNext = false)} /> */}
        {Component}
        {this.slideIndex < normalizedChildren.length - 1 && (
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
