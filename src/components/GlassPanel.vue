<!-- src\components\GlassPanel.vue -->
<template>
  <div class="glass-panel cards">
    <div class="panel-title">
      <slot name="icon"></slot>
      <span>
        {{ title }}
      </span>
    </div>
    <div class="panel-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
 title:{
  type:String,
  required:true
 }
})
</script>
<style scoped lang="scss">
.glass-panel {
width:100%;
padding:1.2rem 1.4rem;
border-radius:14px;
.panel-title {
display:flex;
align-items:center;
font-size:1.05rem;
font-weight:800;
color:#172033;
margin-bottom:1.2rem;
}

.panel-content {
color:#172033;
}
}
</style>