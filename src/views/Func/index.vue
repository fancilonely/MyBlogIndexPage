<!-- src\views\Func\index.vue -->
<template>
  <div
    :class="store.mobileFuncState ? 'function mobile' : 'function'"
  >

    <Transition name="fade" mode="out-in">

      <!-- 默认右侧 -->
      <div
        v-if="store.activeRightPanel === 'default'"
        key="default"
        class="default-panel"
      >

        <!-- 时间 -->
        <div class="info-card cards">

          <div class="card-title">
            当前时间
          </div>

          <div class="time">

            <div class="date">
              {{ currentTime.year }} 年
              {{ currentTime.month }} 月
              {{ currentTime.day }} 日
            </div>


            <div class="text">
              {{ currentTime.hour }}:
              {{ currentTime.minute }}:
              {{ currentTime.second }}
            </div>

          </div>

        </div>


        <!-- 天气 -->
        <div class="info-card cards">

          <div class="card-title">
            天气
          </div>

          <div class="weather-placeholder">
            天气模块准备中
          </div>

        </div>

      </div>


      <!-- 项目列表 -->
      <MoreContent
        v-else-if="store.activeRightPanel === 'projects'"
        key="projects"
        title="项目列表"
      >
          <ProjectList />
      </MoreContent>


      <!-- 技术笔记 -->
      <MoreContent
        v-else-if="store.activeRightPanel === 'notes'"
        key="notes"
        title="技术笔记"
      >

        <div class="content-wrapper">

        <p>
        fancivoid.asia/technology
        </p>

        </div>
      </MoreContent>


      <!-- 所见所感 -->
      <MoreContent
        v-else-if="store.activeRightPanel === 'thoughts'"
        key="thoughts"
        title="所见所感"
      >
        <div class="content-wrapper">
        <p>
          fancivoid.asia/comment
        </p>
        </div>
      </MoreContent>

      <!-- 时光胶囊 -->
      <TimeCapsule
        v-else-if="store.activeRightPanel === 'capsule'"
        key="capsule"
      />

    </Transition>


  </div>
</template>



<script setup>

import {
  onBeforeUnmount,
  onMounted,
  ref
} from "vue";

import {
  getCurrentTime
} from "@/utils/getTime";

import {
  mainStore
} from "@/store";

import TimeCapsule from "@/components/TimeCapsule.vue";

import MoreContent from "@/components/MoreContent.vue";

import ProjectList from "@/components/ProjectList.vue";


const store = mainStore();



const currentTime = ref({});


const timeInterval = ref(null);



const updateTimeData = () => {

  currentTime.value = getCurrentTime();

};



onMounted(() => {

  updateTimeData();

  timeInterval.value = setInterval(
    updateTimeData,
    1000
  );

});



onBeforeUnmount(() => {

  if(timeInterval.value)
    clearInterval(timeInterval.value);

});

</script>



<style lang="scss" scoped>


.function {
  width:100%;
  height:80%;
  min-height:238px;
  display:flex;
  align-items:center;
  justify-content:center;
}



.default-panel {

  width:100%;

  max-width:360px;


  display:flex;

  flex-direction:column;

  gap:14px;


}

.info-card {


  width:100%;

  padding:14px 16px;


  display:flex;

  flex-direction:column;

  align-items:center;

  justify-content:center;


  border-radius:10px;


  background:
    rgba(255,255,255,0.68);


  border:
    1px solid rgba(255,255,255,0.55);


  box-shadow:
    0 18px 50px rgba(35,45,80,0.18);


  backdrop-filter:
    blur(16px);



}



.card-title {


  width:100%;


  margin-bottom:0.6rem;


  font-size:
    0.92rem;


  color:
    rgba(23,32,51,0.62);


  font-weight:
    800;


  letter-spacing:
    0.08em;


}



.time {


  width:100%;

  text-align:center;


}



.date {


  font-size:
    0.93rem;


  color:
    rgba(23,32,51,0.72);


  font-weight:
    600;


}



.text {


  margin-top:6px;


  font-size:
    1.9rem;


  letter-spacing:
    1px;


  color:
    #172033;


  font-weight:
    700;


}



.weather-placeholder {


  color:
    rgba(23,32,51,0.55);


  font-size:
    0.9rem;


}



@media(max-width:720px){


.function{

 min-height:0;

}



.default-panel{

 max-width:100%;

}



.text{

 font-size:
 1.7rem;

}


}



</style>