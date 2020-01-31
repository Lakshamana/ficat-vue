import '~/components/css/Slider.css'

export default {
  functional: true,
  name: 'Slider',
  props: {
    slideIndex: {
      type: Number,
      default: 0
    }
  },
  render(_, { props, children, listeners }) {
    const { slideIndex } = props
    const normalizedChildren = children.filter(c => c.tag)
    return (
      <div class="box-wrapper">
        {slideIndex > 0 && (
          <div
            class="slider-control left"
            aria-label="previous"
            onClick={listeners.previous}
          >
            <span class="symbol">&lt;</span>
          </div>
        )}
        {normalizedChildren[slideIndex]}
        {slideIndex < normalizedChildren.length - 1 && (
          <div
            class="slider-control right"
            aria-label="next"
            onClick={listeners.next}
          >
            <span class="symbol">&gt;</span>
          </div>
        )}
      </div>
    )
  }
}
