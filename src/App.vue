<template>
  <component :is="$route.meta.layout || 'div'">
    <RouterView />
  </component>
</template>

<script setup>

</script>

<style scoped>

</style>
