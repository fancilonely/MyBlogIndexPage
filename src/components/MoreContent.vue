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
  height: auto;
  max-height: 100%;
  min-width: 0;
  min-height: 0;
  box-sizing: border-box;
  animation: fade 0.4s;
  color: #172033;
}
</style>
