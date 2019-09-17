<template>
  <section class="section center">
    <div class="columns is-centered is-mobile">
      <div class="column is-10">
        <card title="Sobre FICAT">
          <div class="columns is-left">
            <div class="column has-text-justified">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in
                diam massa. Nam viverra condimentum metus consectetur auctor.
                Vestibulum faucibus suscipit ornare. Aliquam erat volutpat.
              </p>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in
                diam massa. Nam viverra condimentum metus consectetur auctor.
                Vestibulum faucibus suscipit ornare. Aliquam erat volutpat.
              </p>

              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed in
                diam massa. Nam viverra condimentum metus consectetur auctor.
                Vestibulum faucibus suscipit ornare. Aliquam erat volutpat.
              </p>
            </div>
          </div>
        </card>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import Card from '@/components/Card'

export default {
  name: 'About',

  components: {
    Card
  },

  computed: {
    ...mapState({
      lang: state => state.lang.langTag
    })
  }
}
</script>
