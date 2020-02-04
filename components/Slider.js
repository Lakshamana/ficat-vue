import '~/components/css/Slider.css'

export default {
  functional: true,
  name: 'Slider',
  props: {
    slideIndex: {
      type: Number,
      default: 0
    },
    preventForward: {
      type: Boolean,
      default: true
    }
  },
  render(_, { props, children, listeners }) {
    const { slideIndex, preventForward } = props
    const normalizedChildren = children.filter(c => c.tag)
    return (
      <div class="box-wrapper">
        {slideIndex > 0 && (
          <button
            tabindex="0"
            class="slider-control"
            aria-label="previous"
            onClick={listeners.previous}
          >
            <span class="symbol">&lt;</span>
          </button>
        )}
        {normalizedChildren[slideIndex]}
        {slideIndex < normalizedChildren.length - 1 && (
          <button
            tabindex="0"
            class="slider-control"
            aria-label="next"
            onClick={listeners.next}
            disabled={preventForward}
          >
            <span class="symbol">&gt;</span>
          </button>
        )}
      </div>
    )
  }
}
