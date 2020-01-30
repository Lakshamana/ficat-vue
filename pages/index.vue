<template>
  <section class="section center">
    <div class="columns is-centered is-mobile">
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

<style></style>
