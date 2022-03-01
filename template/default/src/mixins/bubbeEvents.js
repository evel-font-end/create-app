export default (refName) => ({
  mounted () {
    Object.keys(this.$listeners).forEach(event => {
      this.$refs[refName].$on(event, (...args) => {
        this.$emit(event, ...args)
      })
    });
  }
})
