<template>
  <section class="section vcenter">
    <div class="columns is-centered">
      <div class="column is-10">
        <Slider>
          <AuthorshipForm />
          <WorkForm />
          <WorkForm />
        </Slider>
      </div>
    </div>
  </section>
</template>

<script>
import Slider from '~/components/Slider.js'
import AuthorshipForm from '~/components/AuthorshipForm'
import WorkForm from '~/components/WorkForm'

export default {
  name: 'Index',
  components: {
    Slider,
    AuthorshipForm,
    WorkForm
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
