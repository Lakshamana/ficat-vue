<template>
  <div>
    <nav
      class="navbar header has-shadow is-primary"
      role="navigation"
      aria-label="main navigation"
    >
      <div class="navbar-brand">
        <a class="navbar-item" href="/">
          <img src="~assets/buefy.png" alt="Buefy" height="28" />
        </a>

        <div class="navbar-burger">
          <span />
          <span />
          <span />
        </div>
      </div>
      <div class="navbar-menu has-background-white">
        <div class="navbar-start">
          <a class="navbar-item">
            <nuxt-link to="/statistics" exact-active-class="is-active">
              <b-icon icon="star" /> Estatísticas
            </nuxt-link>
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
export default {
  data() {
    return {}
  }
}
</script>
