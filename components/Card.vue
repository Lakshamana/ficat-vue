<template>
  <div class="column">
    <div class="card rounded">
      <header class="card-header">
        <p class="card-header-title has-text-grey">
          {{ title }}
        </p>
      </header>
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
      required: true
    }
  }
}
</script>

<style scoped>
.rounded {
  border-radius: 2px;
}

.card {
  height: 50vh;
}
</style>
