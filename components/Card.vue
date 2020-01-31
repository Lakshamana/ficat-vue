<template>
  <div class="column">
    <div class="card rounded">
      <template v-if="title">
        <header class="card-header">
          <p class="card-header-title has-text-grey">
            {{ title }}
          </p>
        </header>
      </template>
      <div class="card-content">
        <div class="content has-text-centered">
          <span>
            <slot />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    }
  }
}
</script>

<style scoped>
.rounded {
  border-radius: 2px;
}
</style>
