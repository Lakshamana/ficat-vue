<template>
  <section class="section vcenter">
    <div class="columns is-centered">
      <div class="column is-10">
        <Slider>
          <AuthorshipForm />
          <WorkForm />
          <OrientationForm />
          <KeywordForm />
          <SendCatalogDataForm />
        </Slider>
      </div>
    </div>
  </section>
</template>

<script>
import Slider from '~/components/Slider.js'
import { persist } from '~/front/persistence'
import AuthorshipForm from '~/components/AuthorshipForm'
import WorkForm from '~/components/WorkForm'
import OrientationForm from '~/components/OrientationForm'
import KeywordForm from '~/components/KeywordForm'
import SendCatalogDataForm from '~/components/SendCatalogDataForm'

export default {
  name: 'Index',
  components: {
    Slider,
    AuthorshipForm,
    WorkForm,
    OrientationForm,
    KeywordForm,
    SendCatalogDataForm
  },

  created() {
    persist('form', {})
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

.bodyClass,
.htmlClass {
  overflow-y: hidden;
}
</style>

<style>
.select:not(.is-multiple):not(.is-loading)::after {
}
</style>
