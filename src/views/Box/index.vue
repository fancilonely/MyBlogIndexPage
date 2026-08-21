<!-- src\views\Box\index.vue -->
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
        v-show="closeShow"
        @click="store.boxOpenState = false"
      />
    </transition>
      <TimeCapsule />
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

import TimeCapsule from "@/components/TimeCapsule.vue";


const store = mainStore();

const closeShow = ref(false);


</script>



<style lang="scss" scoped>


.box {
  flex:1 0 0%;
  margin-left:0.75rem;
  height:80%;
  width:100%;
  max-width:50%;
  position:relative;
  display:flex;
  justify-content:center;
  align-items:center;
  animation:fade .5s;
  overflow:hidden;
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