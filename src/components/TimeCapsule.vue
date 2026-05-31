<template>
  <div class="time-capsule cards">
    <div class="title">
      <hourglass-full theme="two-tone" size="22" :fill="['#4f7cff', '#d7ddff']" />
      <span>时光胶囊</span>
    </div>

    <div v-if="timeData" class="all-capsule">
      <div v-for="(item, tag, index) in timeData" :key="index" class="capsule-item">
        <div class="item-title">
          <span class="percentage">
            {{ item.name }}已度过
            <strong>{{ item.passed }}</strong>
            {{ tag === "day" ? "小时" : "天" }}
          </span>
          <span class="remaining">
            剩余&nbsp;{{ item.remaining }}&nbsp;{{ tag === "day" ? "小时" : "天" }}
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
        <div class="item-title">{{ startDateText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { HourglassFull } from "@icon-park/vue-next";
import { getTimeCapsule, siteDateStatistics } from "@/utils/getTime.js";

// 进度条数据
const timeData = ref(getTimeCapsule());

// 固定建站日期：2024-01-29
const startDate = new Date("2024-01-29T00:00:00");
const startDateText = ref(siteDateStatistics(startDate));
const timeInterval = ref(null);

onMounted(() => {
  timeInterval.value = setInterval(() => {
    timeData.value = getTimeCapsule();
    startDateText.value = siteDateStatistics(startDate);
  }, 1000);
});

onBeforeUnmount(() => {
  if (timeInterval.value) clearInterval(timeInterval.value);
});
</script>

<style lang="scss" scoped>
.time-capsule {
  width: 100%;
  padding: 1rem 1.1rem;
  color: #172033;

  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.2rem 0 1rem;
    color: #172033;
    font-size: 1.05rem;
    font-weight: 800;

    .i-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 6px;
    }
  }

  .all-capsule {
    .capsule-item {
      margin-bottom: 0.9rem;

      .item-title {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 0.8rem;
        margin: 0.8rem 0 0.45rem;
        color: rgba(23, 32, 51, 0.82);
        font-size: 0.86rem;
        line-height: 1.4;

        strong {
          margin: 0 0.15rem;
          color: #4f7cff;
          font-weight: 800;
        }

        .remaining {
          color: rgba(23, 32, 51, 0.58);
          font-size: 0.8rem;
          font-style: normal;
          white-space: nowrap;
        }
      }

      :deep(.el-progress-bar__outer) {
        background-color: rgba(23, 32, 51, 0.1);
      }

      :deep(.el-progress-bar__inner) {
        background: linear-gradient(
          90deg,
          rgba(79, 124, 255, 0.78),
          rgba(137, 161, 255, 0.9)
        );
      }

      :deep(.el-progress-bar__innerText) {
        color: #ffffff;
        font-size: 0.76rem;
        font-weight: 700;
      }

      &:last-child {
        margin-bottom: 0;
      }

      &.start {
        margin-top: 0.2rem;
        padding-top: 0.75rem;
        border-top: 1px solid rgba(23, 32, 51, 0.1);

        .item-title {
          justify-content: center;
          margin: 0;
          color: rgba(23, 32, 51, 0.7);
          font-size: 0.82rem;
          font-weight: 700;
          text-align: center;
        }
      }
    }
  }
}
</style>