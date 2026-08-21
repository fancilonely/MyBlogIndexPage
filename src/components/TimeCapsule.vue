<!-- src\components\TimeCapsule.vue -->
<template>
  <GlassPanel title="时光胶囊">

    <div v-if="timeData" class="all-capsule">

      <div
        v-for="(item, tag, index) in timeData"
        :key="index"
        class="capsule-item"
      >

        <div class="item-title">

          <span class="percentage">
            {{ item.name }}已度过

            <strong>
              {{ item.passed }}
            </strong>

            {{ tag === "day" ? "小时" : "天" }}
          </span>


          <span class="remaining">
            剩余&nbsp;
            {{ item.remaining }}
            &nbsp;
            {{ tag === "day" ? "小时" : "天" }}
          </span>

        </div>


        <el-progress
          :text-inside="true"
          :stroke-width="18"
          :percentage="parseFloat(item.percentage)"
        />

      </div>



      <!-- 建站日期 -->
      <div class="capsule-item start">

        <div class="item-title">
          {{ startDateText }}
        </div>

      </div>



      <!-- 网站状态 -->
      <div class="capsule-item website-status">

        <div class="item-title">

          <span>
            网站在线
          </span>


          <span class="online">
            Online
          </span>


        </div>

      </div>


    </div>

  </GlassPanel>
</template>



<script setup>

import {
  onBeforeUnmount,
  onMounted,
  ref
} from "vue";


import {
  getTimeCapsule,
  siteDateStatistics
} from "@/utils/getTime.js";



const timeData = ref(
  getTimeCapsule()
);



const startDate =
  new Date("2024-01-29T00:00:00");



const startDateText =
  ref(
    siteDateStatistics(startDate)
  );



const timeInterval =
  ref(null);



onMounted(() => {


  timeInterval.value =
    setInterval(() => {


      timeData.value =
        getTimeCapsule();


      startDateText.value =
        siteDateStatistics(startDate);



    },1000);


});



onBeforeUnmount(() => {


  if(timeInterval.value){

    clearInterval(
      timeInterval.value
    );

  }


});


</script>



<style lang="scss" scoped>


.all-capsule {


  width:100%;


  color:#172033;



}



.capsule-item {


  margin-bottom:
    0.9rem;



  .item-title {


    display:flex;

    flex-direction:row;

    align-items:center;

    justify-content:space-between;


    gap:
      0.8rem;


    margin:
      0.8rem 0 0.45rem;


    color:
      rgba(23,32,51,0.82);


    font-size:
      0.86rem;


    line-height:
      1.4;



    strong {


      margin:
        0 0.15rem;


      color:
        #4f7cff;


      font-weight:
        800;


    }



    .remaining {


      color:
        rgba(23,32,51,0.58);


      font-size:
        0.8rem;


      white-space:
        nowrap;


    }


  }



  :deep(.el-progress-bar__outer){


    background-color:
      rgba(23,32,51,0.1);


  }



  :deep(.el-progress-bar__inner){


    background:
      linear-gradient(
        90deg,
        rgba(79,124,255,0.78),
        rgba(137,161,255,0.9)
      );


  }



  :deep(.el-progress-bar__innerText){


    color:
      #ffffff;


    font-size:
      0.76rem;


    font-weight:
      700;


  }



}



.capsule-item.start {


  margin-top:
    0.2rem;


  padding-top:
    0.75rem;


  border-top:
    1px solid rgba(23,32,51,0.1);



  .item-title {


    justify-content:center;


    margin:0;


    color:
      rgba(23,32,51,0.7);


    font-size:
      0.82rem;


    font-weight:
      700;


  }



}



.website-status {


  margin-top:
    0.8rem;


  padding-top:
    0.8rem;


  border-top:
    1px solid rgba(23,32,51,0.1);



  .item-title {


    font-size:
      0.85rem;


    font-weight:
      700;



  }



  .online {


    color:
      #4caf50;


    display:flex;


    align-items:center;



    &::before {


      content:"";


      width:
        8px;


      height:
        8px;


      margin-right:
        6px;


      border-radius:
        50%;


      background:
        #4caf50;


      box-shadow:
        0 0 8px rgba(76,175,80,.8);



    }



  }



}



</style>