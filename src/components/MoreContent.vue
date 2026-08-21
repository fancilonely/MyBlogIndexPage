<!-- src\components\MoreContent.vue -->
<template>
  <GlassPanel :title="title">
    <div class="more-content">
      <slot />
    </div>
  </GlassPanel>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>

<style lang="scss" scoped>
.more-content {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display:flex;
  justify-content:center;
  padding: 0.8rem 1rem 1rem;
  overflow-y: auto;
  animation: fade 0.4s;
  color: #172033;
  scrollbar-width: thin;
}
</style>