<template>
  <div class="box cards" @mouseenter="closeShow = true" @mouseleave="closeShow = false">
    <transition name="el-fade-in-linear">
      <close-one
        class="close"
        theme="filled"
        size="26"
        fill="rgba(23, 32, 51, 0.48)"
        v-show="closeShow"
        @click="store.boxOpenState = false"
      />
    </transition>

    <transition name="el-fade-in-linear">
      <setting-two
        class="setting"
        theme="filled"
        size="26"
        fill="rgba(23, 32, 51, 0.48)"
        v-show="closeShow"
        @click="store.setOpenState = false"
      />
    </transition>

    <div class="content">
      <TimeCapsule class="capsule-in-box" />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { CloseOne, SettingTwo } from "@icon-park/vue-next";
import { mainStore } from "@/store";
import TimeCapsule from "@/components/TimeCapsule.vue";

const store = mainStore();
const closeShow = ref(false);
</script>

<style lang="scss" scoped>
.box {
  flex: 1 0 0%;
  margin-left: 0.75rem;
  height: 80%;
  max-width: 50%;
  position: relative;
  animation: fade 0.5s;
  overflow: hidden;

  &:hover {
    transform: scale(1);
  }

  .close,
  .setting {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 26px;
    height: 26px;
    z-index: 3;
    cursor: pointer;
    transition:
      transform 0.3s,
      opacity 0.3s;

    &:hover {
      transform: scale(1.16);
    }

    &:active {
      transform: scale(1);
    }
  }

  .setting {
    right: 52px;
  }

  .content {
    width: 100%;
    height: 100%;
    padding: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .capsule-in-box {
    width: 100%;
    max-width: 520px;
  }
}
</style>