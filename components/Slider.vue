<template>
  <section class="section center">
    <div class="columns is-centered is-mobile">
      <div class="column is-10">
        <keep-alive>
          <component :is="slides[idx]" />
        </keep-alive>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    startIndex: {
      type: Number,
      default: 0
    },
    slides: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      idx: this.startIndex
    }
  }
}
</script>
