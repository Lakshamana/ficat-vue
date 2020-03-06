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
            :aria-roledescription="path"
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
          <div class="navbar-item is-paddingless">|</div>
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
    <div class="container">
      <nuxt />
      <div
        class="fb-customerchat"
        attribution="setup_tool"
        page_id="103822584563032"
        theme_color="#0d2167"
      ></div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
const MessageCodes = require('../shared/messageCodes')

export default {
  computed: {
    ...mapState({
      lang: state => state.lang.langTag
    }),

    paths() {
      return {
        about: this.$tr(this.lang, MessageCodes.layout.ltAbout),
        talk: this.$tr(this.lang, MessageCodes.layout.ltTalkUs)
      }
    }
  },

  mounted() {
    // Add init FB SDK function
    const initSdk = document.createElement('script')
    initSdk.innerHTML = `window.fbAsyncInit = function() {
      FB.init({
        appId: '197652141644385',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v6.0'
      })
    }`

    // Add FB SDK sources
    const el = document.createElement('script')
    el.async = true
    el.defer = true
    el.src = 'https://connect.facebook.net/en_US/sdk.js'
    console.log('mounted')

    // Init fb messenger customer chat SDK
    const chatSrc = document.createElement('script')
    chatSrc.innerHTML = `(function(d, s, id) {
      const fjs = d.getElementsByTagName(s)[0]
      if (d.getElementById(id)) return
      const js = d.createElement(s)
      js.id = id
      js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js'
      fjs.parentNode.insertBefore(js, fjs)
    })(document, 'script', 'facebook-jssdk')`

    document.body.insertBefore(chatSrc, document.body.firstChild)
    document.body.insertBefore(el, document.body.firstChild)
    document.body.insertBefore(initSdk, document.body.firstChild)
  },

  methods: {
    setLang(langKey) {
      this.$store.dispatch('lang/change', langKey)
    }
  }
}
</script>
