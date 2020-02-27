export default {
  methods: {
    handle({ response }) {
      this.$buefy.toast.open({
        duration: 1000,
        message: response.data.code,
        type: 'is-danger'
      })
    }
  }
}
