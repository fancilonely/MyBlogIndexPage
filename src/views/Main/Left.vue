<!-- src\views\Main\Left.vue -->
<template>
  <div
    :class="{
      left: true,
      hidden: store.mobileOpenState,
      'box-open': store.boxOpenState,
    }"
  >
    <Message />
    <SocialLinks />
  </div>
</template>

<script setup>
import { mainStore } from "@/store";
import Message from "@/components/Message.vue";
import SocialLinks from "@/components/SocialLinks.vue";

const store = mainStore();
</script>

<style lang="scss" scoped>
.left {
  width: 50%;
  margin-right: 10px;
  transform: translate3d(0, 20px, 0);
  opacity: 1;

  /*
    平滑滑动参考 CPT304 那种柔和交互速度：
    0.42s + cubic-bezier(0.22, 1, 0.36, 1)
    感觉会比普通 ease 更顺。
  */
  transition:
    transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.28s ease;

  will-change: transform, opacity;

  &.box-open {
    /*
      打开时光胶囊时，左侧整体稍微向左滑动。
      如果你觉得移动太多，把 -4vw 改成 -3vw；
      如果还不够明显，改成 -5vw。
    */
    transform: translate3d(-4vw, 20px, 0);
  }

  &.hidden {
    display: none;
  }

  @media (max-width: 1200px) {
    &.box-open {
      transform: translate3d(-2.5vw, 20px, 0);
    }
  }

  @media (max-width: 720px) {
    margin-right: 0;
    width: 100%;
    transform: translate3d(0, 20px, 0);

    &.box-open {
      transform: translate3d(0, 20px, 0);
    }
  }
}
</style>