<template>
  <div
    class="box"
    @mouseenter="closeShow = true"
    @mouseleave="closeShow = false"
  >

    <transition name="el-fade-in-linear">

      <close-one
        class="close"
        theme="filled"
        size="26"
        fill="rgba(23, 32, 51, 0.48)"
        v-show="closeShow && store.boxOpenState"
        @click="closePanel"
      />
    </transition>

    <div class="right-panel">
      <Func />
    </div>
  </div>
</template>



<script setup>

import { ref } from "vue";

import {
  CloseOne
} from "@icon-park/vue-next";

import {
  mainStore
} from "@/store";

import Func from "@/views/Func/index.vue";


const store = mainStore();

const closeShow = ref(false);

const closePanel = () => {
  store.activeRightPanel = "default";
  store.boxOpenState = false;
};


</script>



<style lang="scss" scoped>


.box {
  width: 100%;
  height: 100%;
  max-width: 520px;
  min-width: 0;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fade 0.5s;
  overflow: hidden;
}

.right-panel {
  width: 100%;
  height: 100%;
  max-width: 520px;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
}

.close {

  position:absolute;

  top:14px;

  right:14px;

  width:26px;

  height:26px;

  z-index:3;

  cursor:pointer;


  transition:
  transform .3s,
  opacity .3s;


  &:hover {

    transform:scale(1.16);

  }


  &:active {

    transform:scale(1);

  }

}



</style>

