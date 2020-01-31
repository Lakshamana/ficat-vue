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
    console.log(slideIndex)
    const normalizedChildren = children.filter(c => c.tag)
    console.log(normalizedChildren)
    return (
      <div className="box-wrapper">
        {slideIndex > 0 && (
          <div className="slider-control left" onClick={listeners.previous}>
            <span className="symbol">&lt;</span>
          </div>
        )}
        {normalizedChildren[slideIndex]}
        {slideIndex < normalizedChildren.length - 1 && (
          <div className="slider-control right" onClick={listeners.next}>
            <span className="symbol">&gt;</span>
          </div>
        )}
      </div>
    )
  }
}
