<template>
  <div :class="store.mobileFuncState ? 'function mobile' : 'function'">
    <TimeCapsule
      v-if="showCapsule"
      class="capsule-panel"
    />

    <div v-else class="default-panel">
      <div class="info-card time-card cards">
        <div class="card-title">当前时间</div>
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

      <div class="status-card cards">
        <div class="status-title">状态</div>

        <div class="status-row">
          <span class="status-name">主入口</span>
          <span class="status-value"><span class="signal">▰▰▰</span> 在线</span>
        </div>

        <div class="status-row">
          <span class="status-name">归档库</span>
          <span class="status-value"><span class="signal">▰▰▰</span> 在线</span>
        </div>

        <div class="status-row">
          <span class="status-name">笔记区</span>
          <span class="status-value"><span class="signal">▰▰▰</span> 在线</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { getCurrentTime } from "@/utils/getTime";
import { mainStore } from "@/store";
import TimeCapsule from "@/components/TimeCapsule.vue";

const store = mainStore();

// 当前时间
const currentTime = ref({});
const timeInterval = ref(null);

// 桌面端才允许显示时光胶囊
const showCapsule = computed(() => {
  return store.boxOpenState && store.getInnerWidth >= 721;
});

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
  position: relative;
  width: 100%;
  min-height: 238px;
  height: auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  &.mobile {
    align-items: flex-start;
  }

  .default-panel {
    width: 100%;
    max-width: 360px;
    min-height: 238px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    align-items: stretch;
    width: 100%;

    .info-card {
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      animation: fade 0.5s;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.68);
      border: 1px solid rgba(255, 255, 255, 0.55);
      box-shadow: 0 18px 50px rgba(35, 45, 80, 0.18);
      backdrop-filter: blur(16px);

      .card-title {
        align-self: flex-start;
        font-size: 0.92rem;
        color: rgba(23, 32, 51, 0.62);
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 0.6rem;
      }
    }

    .status-card {
      width: 100%;
      padding: 1rem 1.1rem;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      justify-content: center;
      animation: fade 0.5s;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.68);
      border: 1px solid rgba(255, 255, 255, 0.55);
      box-shadow: 0 18px 50px rgba(35, 45, 80, 0.18);
      backdrop-filter: blur(16px);
    }

    .status-title {
      margin-bottom: 0.75rem;
      color: rgba(23, 32, 51, 0.75);
      font-size: 1rem;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .time {
      width: 100%;
      text-align: center;
      opacity: 1;

      .date {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 0.93rem;
        color: rgba(23, 32, 51, 0.72);
        font-weight: 600;
      }

      .text {
        margin-top: 6px;
        font-size: 1.9rem;
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

    .status-row {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 44px;
      margin-top: 0.65rem;
      padding: 0 1rem;
      border-radius: 999px;
      background: rgba(245, 248, 255, 0.78);
      border: 1px solid rgba(255, 255, 255, 0.62);

      &:first-of-type {
        margin-top: 0;
      }
    }

    .status-name {
      color: rgba(23, 32, 51, 0.86);
      font-size: 1.05rem;
      font-weight: 800;
    }

    .status-value {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      color: #4f7cff;
      font-size: 1rem;
      font-weight: 900;

      .signal {
        display: inline-flex;
        align-items: center;
        color: #4f7cff;
        font-size: 0.94rem;
        letter-spacing: 0.02em;
      }
    }
  }
  .capsule-panel {
    width: 100%;
  }
}


@media (max-width: 720px) {
  .function {
    min-height: 0;

    .default-panel {
      max-width: 100%;
    }

    .info-card {
      padding: 13px 14px;
    }

    .status-card {
      padding: 0.95rem 1rem;
    }

    .time .text {
      font-size: 1.7rem;
    }

    .status-row {
      padding: 0 0.82rem;
    }

    .status-name {
      font-size: 1rem;
    }

    .status-value {
      font-size: 0.96rem;
    }
  }
}
</style>