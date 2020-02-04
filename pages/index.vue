<template>
  <section class="section vcenter">
    <div class="columns is-centered">
      <div class="column is-10">
        <Slider
          :slide-index="slideIdx"
          :prevent-forward="preventForward"
          @next="slideIdx++"
          @previous="slideIdx--"
        >
          <AuthorshipForm
            @ready="preventForward = false"
            @disableForward="preventForward = true"
          />
          <WorkForm
            @ready="preventForward = false"
            @disableForward="preventForward = true"
          />
        </Slider>
      </div>
    </div>
  </section>
</template>

<script>
import Slider from '../components/Slider.js'
import AuthorshipForm from '~/components/AuthorshipForm'
import WorkForm from '~/components/WorkForm'

export default {
  name: 'Index',
  components: {
    Slider,
    AuthorshipForm,
    WorkForm
  },
  data() {
    return {
      slideIdx: 0,
      preventForward: true
    }
  },

  methods: {
    toggleForward() {
      this.preventForward = !this.preventForward
    }
  }
}
</script>

<style scoped>
.vcenter {
  display: flex;
  height: 90vh;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.columns {
  margin: auto;
  flex: 1 0 auto;
}
</style>

<style>
.bodyClass,
.htmlClass {
  overflow-y: hidden;
}
</style>

<style>
.select:not(.is-multiple):not(.is-loading)::after {
}
</style>
