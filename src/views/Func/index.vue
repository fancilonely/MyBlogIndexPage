<template>
  <!-- 功能区域 -->
  <div :class="store.mobileFuncState ? 'function mobile' : 'function'">
    <Transition name="func-slide">
      <!-- 点击左侧简介后：显示时光胶囊 -->
      <div v-if="store.boxOpenState" key="capsule" class="box-panel">
        <TimeCapsule />
      </div>

      <!-- 默认功能区：音乐 + 当前时间 -->
      <el-row v-else key="default" :gutter="20">
        <el-col :span="12">
          <div class="left">
            <Music v-if="playerHasId" />
          </div>
        </el-col>

        <el-col :span="12">
          <div class="right time-card">
            <div class="time">
              <div class="date">
                <span>{{ currentTime.year }}&nbsp;年&nbsp;</span>
                <span>{{ currentTime.month }}&nbsp;月&nbsp;</span>
                <span>{{ currentTime.day }}&nbsp;日&nbsp;</span>
                <span class="sm-hidden">{{ currentTime.weekday }}</span>
              </div>
              <div class="text">
                <span>{{ currentTime.hour }}:{{ currentTime.minute }}:{{ currentTime.second }}</span>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </Transition>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";
import { getCurrentTime } from "@/utils/getTime";
import { mainStore } from "@/store";
import Music from "@/components/Music.vue";
import TimeCapsule from "@/components/TimeCapsule.vue";

const store = mainStore();

// 当前时间
const currentTime = ref({});
const timeInterval = ref(null);

// 播放器 id
const playerHasId = import.meta.env.VITE_SONG_ID;

// 更新时间
const updateTimeData = () => {
  currentTime.value = getCurrentTime();
};

onMounted(() => {
  updateTimeData();
  timeInterval.value = setInterval(updateTimeData, 1000);
});

onBeforeUnmount(() => {
  if (timeInterval.value) clearInterval(timeInterval.value);
});
</script>

<style lang="scss" scoped>
.function {
  min-height: 120px;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  &.mobile {
    .el-row {
      .el-col {
        &:nth-of-type(1) {
          display: contents;
        }

        &:nth-of-type(2) {
          display: none;
        }
      }
    }
  }

  .el-row {
    height: 120px;
    width: 100%;
    margin: 0 !important;

    .el-col {
      &:nth-of-type(1) {
        padding-left: 0 !important;
      }

      &:nth-of-type(2) {
        padding-right: 0 !important;
      }

      @media (max-width: 910px) {
        &:nth-of-type(1) {
          display: none;
        }

        &:nth-of-type(2) {
          padding: 0 !important;
          flex: none;
          max-width: none;
          width: 100%;
        }
      }
    }

    .left,
    .right {
      width: 100%;
      height: 100%;
    }

    .left {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .right {
      padding: 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      animation: fade 0.5s;
    }

    .time-card {
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.68);
      border: 1px solid rgba(255, 255, 255, 0.55);
      box-shadow: 0 18px 50px rgba(35, 45, 80, 0.18);
      backdrop-filter: blur(16px);
    }

    .time {
      font-size: 0.95rem;
      text-align: center;
      opacity: 1;

      .date {
        text-overflow: ellipsis;
        overflow-x: hidden;
        white-space: nowrap;
        font-size: 0.95rem;
        color: rgba(23, 32, 51, 0.78);
        font-weight: 600;
      }

      .text {
        margin-top: 6px;
        font-size: 1.8rem;
        letter-spacing: 1px;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #172033;
        font-weight: 700;
      }

      @media (min-width: 1201px) and (max-width: 1280px) {
        font-size: 0.95rem;
      }

      @media (min-width: 911px) and (max-width: 992px) {
        font-size: 0.95rem;

        .text {
          font-size: 1.6rem;
        }
      }
    }
  }

  .box-panel {
    width: 100%;
  }
}

/* 右侧模块滑动替换动画 */
.func-slide-enter-active,
.func-slide-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.func-slide-enter-from {
  opacity: 0;
  transform: translateX(18px);
}

.func-slide-leave-to {
  opacity: 0;
  transform: translateX(-18px);
}

.func-slide-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

@media (max-width: 720px) {
  .function {
    min-height: 0;

    .box-panel {
      display: none;
    }
  }
}
</style>