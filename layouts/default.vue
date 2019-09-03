<template>
  <div>
    <nav
      class="navbar header has-shadow is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a class="navbar-item" href="/" aria-label="Initial Page">
          <img src="~assets/buefy.png" alt="Buefy" height="28" />
        </a>

        <div class="navbar-burger">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div class="navbar-menu has-background-black">
        <div class="navbar-start">
          <a
            v-for="(path, key) in paths"
            :key="key"
            class="navbar-item"
            :aria-label="path"
          >
            <nuxt-link :to="key" exact-active-class="is-active">
              {{ path }}
            </nuxt-link>
          </a>
        </div>
        <div class="navbar-end">
          <a
            class="navbar-item"
            exact-active-class="is-active"
            @click="setLang('pt')"
          >
            pt
          </a>
          <a class="navbar-item is-paddingless">|</a>
          <a
            class="navbar-item"
            exact-active-class="is-active"
            @click="setLang('en')"
          >
            en
          </a>
        </div>
      </div>
    </nav>

    <div class="container column is-10">
      <nuxt />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import codes from '../shared/messageCodes'

export default {
  computed: {
    ...mapState({
      lang: state => state.langTag
    }),

    paths() {
      return {
        about: this.$tr(this.lang, codes.layout.ltAbout),
        instructions: this.$tr(this.lang, codes.layout.ltInstructions),
        talk: this.$tr(this.lang, codes.layout.ltTalkUs)
      }
    }
  },

  methods: {
    setLang(langKey) {
      this.$store.commit('lang/setLangTag', langKey)
    }
  }
}
</script>

<style></style>
