<template>
  <section class="section vcenter">
    <div class="columns is-centered">
      <div class="column is-10">
        <Slider>
          <AuthorshipForm></AuthorshipForm>
        </Slider>
      </div>
    </div>
  </section>
</template>

<script>
// const pattern = /^[a-zA-Z\u00C0-\u017F ]{5,}$/
import Slider from '~/components/Slider'

export default {
  name: 'Index',
  components: {
    Slider,
    AuthorshipForm: () => import('~/components/AuthorshipForm')
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
