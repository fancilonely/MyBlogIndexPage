<template>
  <div class="glass-panel cards">
    <div class="panel-title">
      <slot name="icon"></slot>
      <span>{{ title }}</span>
    </div>

    <div class="panel-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<style scoped lang="scss">
.glass-panel {
  width: 100%;
  height: auto;
  max-height: 100%;
  min-width: 0;
  min-height: 0;
  padding: 1.2rem 1.4rem;
  box-sizing: border-box;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .panel-title {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    font-size: 1.05rem;
    font-weight: 800;
    color: #172033;
    margin-bottom: 1.2rem;
  }

  .panel-content {
    width: 100%;
    flex: 0 1 auto;
    min-height: 0;
    color: #172033;
    overflow-y: auto;
    scrollbar-width: thin;
  }
}
</style>
