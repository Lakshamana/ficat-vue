<template>
  <keep-alive>
    <component :is="$options.components[type]" />
  </keep-alive>
</template>

<script>
import AuthorshipForm from '~/components/AuthorshipForm'
export default {
  name: 'Slider',
  components: {
    AuthorshipForm
  },
  props: {
    startIndex: {
      type: Number,
      default: 0
    }
    // slides: {
    //   type: Object,
    //   required: true
    // }
  },
  computed: {
    type() {
      return Object.keys(this.$options.components)[this.startIndex]
    },
    component() {
      return this.$options.components[this.type]
    }
  }
}
</script>

<style>
.error {
  color: red;
  font-size: 7pt;
}
</style>
