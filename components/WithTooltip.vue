<template>
  <div class="with-tooltip">
    <div v-if="!!text" class="tooltip">{{ text }}</div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'WithTooltip',
  props: {
    text: {
      type: String,
      required: true
    }
  }
}
</script>

<style>
.with-tooltip {
  border: 1px solid red;
  box-sizing: border-box;
  position: relative;
  margin: 1em 0;
}

.with-tooltip .tooltip {
  position: absolute;
  box-sizing: border-box;
  visibility: hidden;
  padding: 0.5em;
  background-color: #555c;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  transform: translateY(-120%);
  z-index: 64;
  opacity: 0;
  transition: opacity 0.5s ease-in;
}

.with-tooltip .tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  border-width: 5px;
  border-style: solid;
  border-color: #555c transparent transparent transparent;
}

.with-tooltip:hover .tooltip {
  visibility: visible;
  opacity: 1;
}
</style>
