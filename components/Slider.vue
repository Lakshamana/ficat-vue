<template functional>
  <div class="is-full">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Slider',
  props: {
    startIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentIndex: this.startIndex
    }
  },
  computed: {
    type() {
      return Object.keys(this.$options.components)[this.startIndex]
    },
    component() {
      return this.$options.components[this.type]
    }
  },
  render(h, { props, children, data }) {
    return h('div', data, children[this.currentIndex])
  }
}
</script>

<style>
input,
select,
textarea {
  outline: none;
}

.error {
  color: red;
  font-size: 9pt;
  display: block;
  float: left;
  z-index: 5;
}

.error::after {
  content: '';
  clear: both;
}
</style>
