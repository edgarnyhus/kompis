<template>
  <div>
    <md-progress-spinner md-mode="indeterminate"></md-progress-spinner>
    <md-progress-spinner class="md-accent" md-mode="indeterminate"></md-progress-spinner>
  </div>
</template>

<script>
  export default {
    name: 'ProgressSpinner'
  }
</script>

<style scoped>
  .md-progress-spinner {
    margin: 24px;
  }
</style>
