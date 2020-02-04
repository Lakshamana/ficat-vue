<template>
  <section class="section vcenter">
    <div class="columns is-centered">
      <div class="column is-10">
        <Slider
          :slide-index="slideIdx"
          @next="slideIdx++"
          @previous="slideIdx--"
        >
          <AuthorshipForm />
          <WorkForm />
        </Slider>
      </div>
    </div>
  </section>
</template>

<script>
// const pattern = /^[a-zA-Z\u00C0-\u017F ]{5,}$/
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
      slideIdx: 0
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
