<template>
  <div class="function">
    <!--
      五个界面严格互斥。

      没有 Transition。
      没有 out-in。
      没有上一页退场。

      activeRightPanel 是什么，
      就只创建什么。
    -->

    <!-- 1. 时间 / 天气 -->
    <div
      v-if="
        store.activeRightPanel ===
        'default'
      "
      class="panel-view default-panel"
    >
      <!-- 当前时间 -->
      <div class="info-card cards">
        <div class="card-title">
          当前时间
        </div>

        <div class="time">
          <div class="date">
            {{ currentTime.year }}
            年
            {{ currentTime.month }}
            月
            {{ currentTime.day }}
            日
          </div>

          <div class="text">
            {{ currentTime.hour }}:{{
              currentTime.minute
            }}:{{
              currentTime.second
            }}
          </div>
        </div>
      </div>

      <!-- 天气 -->
      <div class="info-card cards">
        <div class="card-title">
          天气
        </div>

        <Weather />
      </div>
    </div>

    <!-- 2. 项目 -->
    <div
      v-else-if="
        store.activeRightPanel ===
        'projects'
      "
      class="panel-view"
    >
      <MoreContent title="项目列表">
        <ProjectList />
      </MoreContent>
    </div>

    <!-- 3. 技术笔记 -->
    <div
      v-else-if="
        store.activeRightPanel ===
        'notes'
      "
      class="panel-view"
    >
      <MoreContent title="技术笔记">
        <ArticleList
          category="technology"
          all-url="https://www.fancivoid.asia/technology/"
          :limit="4"
        />
      </MoreContent>
    </div>

    <!-- 4. 所见所感 -->
    <div
      v-else-if="
        store.activeRightPanel ===
        'thoughts'
      "
      class="panel-view"
    >
      <MoreContent title="所见所感">
        <ArticleList
          category="comment"
          all-url="https://www.fancivoid.asia/comment/"
          :limit="4"
        />
      </MoreContent>
    </div>

    <!-- 5. 时光胶囊 -->
    <div
      v-else-if="
        store.activeRightPanel ===
        'capsule'
      "
      class="panel-view"
    >
      <TimeCapsule />
    </div>
  </div>
</template>

<script setup>
import {
  onBeforeUnmount,
  onMounted,
  ref,
} from "vue";

import {
  getCurrentTime,
} from "@/utils/getTime";

import {
  mainStore,
} from "@/store";

import ArticleList from "@/components/ArticleList.vue";
import MoreContent from "@/components/MoreContent.vue";
import ProjectList from "@/components/ProjectList.vue";
import TimeCapsule from "@/components/TimeCapsule.vue";
import Weather from "@/components/Weather.vue";

const store = mainStore();

const currentTime = ref({});

const timeInterval = ref(null);

const updateTimeData = () => {
  currentTime.value =
    getCurrentTime();
};

onMounted(() => {
  updateTimeData();

  timeInterval.value =
    window.setInterval(
      updateTimeData,
      1000,
    );
});

onBeforeUnmount(() => {
  if (timeInterval.value) {
    window.clearInterval(
      timeInterval.value,
    );
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

/*
  当前唯一存在的界面。
*/
.panel-view {
  width: 100%;
  height: 100%;

  min-width: 0;
  min-height: 0;

  display: flex;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  /*
    只让“新页面”轻微淡入。

    因为旧页面已经直接销毁，
    所以绝不会出现旧页面退场动画。
  */
  animation:
    panel-in
    0.18s ease-out;
}

.default-panel {
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

  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.55
    );

  border-radius: 10px;

  background:
    rgba(
      255,
      255,
      255,
      0.68
    );

  box-shadow:
    0 18px 50px
    rgba(
      35,
      45,
      80,
      0.18
    );

  backdrop-filter:
    blur(16px);
}

.card-title {
  width: 100%;

  margin-bottom:
    0.6rem;

  color:
    rgba(
      23,
      32,
      51,
      0.62
    );

  font-size: 0.92rem;

  font-weight: 800;

  letter-spacing:
    0.08em;
}

.time {
  width: 100%;

  text-align: center;
}

.date {
  color:
    rgba(
      23,
      32,
      51,
      0.72
    );

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

@keyframes panel-in {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (max-width: 720px) {
  .function {
    height: 100%;

    min-height: 0;
  }

  .panel-view {
    height: 100%;
  }

  .text {
    font-size: 1.7rem;
  }
}
</style>