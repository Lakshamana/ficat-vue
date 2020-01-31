<template functional>
  <div class="wrapper">
    <div
      v-if="currentIndex > 0"
      class="slider-control left"
      @click="currentIndex++"
    >
      <span class="symbol">&lt;</span>
    </div>
    <slot></slot>
    <div
      v-if="currentIndex < children.length"
      class="slider-control right"
      @click="currentIndex--"
    >
      <span class="symbol">&gt;</span>
    </div>
  </div>
</template>

<script jsx>
export default {
  name: 'Slider',
  props: {
    startIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentIndex: this.startIndex
    }
  },
  render(h, { children, data }) {
    //   return (
    //     <div className="wrapper">
    //       {this.currentIndex > 0 && (
    //         <div className="slider-control right" onClick={this.currentIndex++}>
    //           <span className="symbol">&lt;</span>
    //         </div>
    //       )}
    //       <slot></slot>
    //       {this.currentIndex < children.length && (
    //         <div className="slider-control right" onClick={this.currentIndex--}>
    //           <span className="symbol">&gt;</span>
    //         </div>
    //       )}
    //     </div>
    //   )
    // }
    return h('div', data, children)
  }
}
</script>

<style scoped>
.wrapper {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.slider-control {
  flex: 0 1 auto;
  align-self: stretch;
  /* border-width: 1px; */
  /* border-style: solid; */
  text-align: center;
  display: flex;
  flex-direction: column;
}

/* .right {
  border-color: transparent transparent transparent black;
}

.left {
  border-color: transparent black transparent transparent;
} */

.symbol {
  margin: auto 0;
  width: 3em;
}
</style>

<style>
input,
select,
textarea {
  outline: none;
}

.error {
  color: red;
  font-size: 9pt;
  min-width: 100%;
  text-align: left;
  display: block;
  height: 1rem;
  margin-top: -1em;
}
</style>
