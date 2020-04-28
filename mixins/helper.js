export default {
  mounted() {
    this.$refs[this.initialRef].focus()
  },

  methods: {
    checkNext() {
      const { validations } = this.$options
      this.$v.$touch()
      for (const field in validations) {
        if (this.$v[field].$invalid) {
          this.$refs[field].focus()
          return false
        }
      }
      return true
    }
  }
}
