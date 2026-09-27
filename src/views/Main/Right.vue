<template>
  <!--
    桌面端：
    Right 始终存在。

    手机版：
    只有 mobileOpenState === true
    才真正创建 Right。

    因此手机版关闭右页以后，
    上一个页面的 DOM 会被彻底销毁。
  -->
  <div
    v-if="shouldRenderRight"
    class="right"
  >
    <Box
      :key="mobilePanelKey"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";

import {
  mainStore,
} from "@/store";

import Box from "@/views/Box/index.vue";

const store = mainStore();

/*
  桌面：
  永远显示 Right。

  手机：
  只在用户明确打开某个右页时创建。
*/
const shouldRenderRight =
  computed(() => {
    if (
      store.getInnerWidth >= 721
    ) {
      return true;
    }

    return store.mobileOpenState;
  });

/*
  手机版每个界面使用独立 key。

  即使以后存在某种程序化切换，
  Vue 也会直接创建新的 Box，
  不复用上一页实例。
*/
const mobilePanelKey =
  computed(() => {
    if (
      store.getInnerWidth >= 721
    ) {
      return "desktop-right";
    }

    return `mobile-${store.activeRightPanel}`;
  });
</script>

<style lang="scss" scoped>
.right {
  flex: 1 1 0;

  width: 100%;
  max-width: 520px;
  min-width: 0;

  height: 80%;

  margin-left: 0.75rem;

  display: flex;

  align-items: center;

  justify-content: center;

  @media (max-width: 720px) {
    margin-left: 0;

    width: 100%;
    max-width: none;

    height: 100%;

    display: flex;

    align-items: center;

    justify-content: center;
  }
}
</style>