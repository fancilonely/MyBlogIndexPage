<template>
  <div :class="store.mobileFuncState ? 'function mobile' : 'function'">
    <Transition name="fade" mode="out-in">
      <!-- 默认右侧 -->
      <div
        v-if="store.activeRightPanel === 'default'"
        key="default"
        class="default-panel"
      >
        <!-- 时间 -->
        <div class="info-card cards">
          <div class="card-title">当前时间</div>

          <div class="time">
            <div class="date">
              {{ currentTime.year }} 年 {{ currentTime.month }} 月
              {{ currentTime.day }} 日
            </div>

            <div class="text">
              {{ currentTime.hour }}:{{ currentTime.minute }}:{{ currentTime.second }}
            </div>
          </div>
        </div>

        <!-- 天气 -->
        <div class="info-card cards">
          <div class="card-title">天气</div>
          <Weather />
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
        <ArticleList
          category="technology"
          all-url="https://www.fancivoid.asia/technology/"
          :limit="4"
        />
      </MoreContent>

      <!-- 所见所感 -->
      <MoreContent
        v-else-if="store.activeRightPanel === 'thoughts'"
        key="thoughts"
        title="所见所感"
      >
        <ArticleList
          category="comment"
          all-url="https://www.fancivoid.asia/comment/"
          :limit="4"
        />
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
import { onBeforeUnmount, onMounted, ref } from "vue";
import { getCurrentTime } from "@/utils/getTime";
import { mainStore } from "@/store";
import ArticleList from "@/components/ArticleList.vue";
import MoreContent from "@/components/MoreContent.vue";
import ProjectList from "@/components/ProjectList.vue";
import TimeCapsule from "@/components/TimeCapsule.vue";
import Weather from "@/components/Weather.vue";

const store = mainStore();
const currentTime = ref({});
const timeInterval = ref(null);

const updateTimeData = () => {
  currentTime.value = getCurrentTime();
};

onMounted(() => {
  updateTimeData();
  timeInterval.value = window.setInterval(updateTimeData, 1000);
});

onBeforeUnmount(() => {
  if (timeInterval.value) {
    window.clearInterval(timeInterval.value);
  }
});
</script>

<style lang="scss" scoped>
.function {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 238px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.default-panel {
  width: 100%;
  height: 100%;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
}

.info-card {
  width: 100%;
  padding: 14px 16px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.55);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.68);
  box-shadow: 0 18px 50px rgba(35, 45, 80, 0.18);
  backdrop-filter: blur(16px);
}

.card-title {
  width: 100%;
  margin-bottom: 0.6rem;
  color: rgba(23, 32, 51, 0.62);
  font-size: 0.92rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.time {
  width: 100%;
  text-align: center;
}

.date {
  color: rgba(23, 32, 51, 0.72);
  font-size: 0.93rem;
  font-weight: 600;
}

.text {
  margin-top: 6px;
  color: #172033;
  font-size: 1.9rem;
  font-weight: 700;
  letter-spacing: 1px;
}

@media (max-width: 720px) {
  .function {
    height: 100%;
    min-height: 0;
  }

  .text {
    font-size: 1.7rem;
  }
}
</style>
