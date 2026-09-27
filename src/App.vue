<template>
  <div id="page">
    <Loading :loaded="appReady" />

    <!-- 壁纸独立加载 -->
    <Background @loadComplete="loadComplete" />

    <!-- 粒子 -->
    <FloatingParticles />

    <Transition name="fade" mode="out-in">
      <main id="main">
        <div class="container" v-show="!store.backgroundShow">
          <section class="all" v-show="!store.setOpenState">
            <MainLeft />
            <MainRight />
          </section>

          <section
            class="more"
            v-show="store.setOpenState"
            @click="store.setOpenState = false"
          >
            <MoreSet />
          </section>
        </div>

      </main>
    </Transition>

    <!-- 手机版总开关：保持在视口底部，不参与主内容缩放。 -->
    <Icon
      class="menu"
      size="24"
      v-show="!store.backgroundShow"
      @click="toggleMobilePanel"
    >
      <component
        :is="store.mobileOpenState ? CloseSmall : HamburgerButton"
      />
    </Icon>

    <Transition name="fade" mode="out-in">
      <Footer
        v-show="!store.backgroundShow && !store.setOpenState"
      />
    </Transition>
  </div>
</template>

<script setup>
import { helloInit, checkDays } from "@/utils/getTime.js";
import {
  HamburgerButton,
  CloseSmall,
} from "@icon-park/vue-next";

import { mainStore } from "@/store";
import { Icon } from "@vicons/utils";
import {
  prefetchHomeApis,
} from "@/utils/apiData.js";
import Loading from "@/components/Loading.vue";
import MainLeft from "@/views/Main/Left.vue";
import MainRight from "@/views/Main/Right.vue";
import Background from "@/components/Background.vue";
import FloatingParticles from "@/components/FloatingParticles.vue";
import Footer from "@/components/Footer.vue";
import MoreSet from "@/views/MoreSet/index.vue";

import cursorInit from "@/utils/cursor.js";
import config from "@/../package.json";

const store = mainStore();

const appReady = ref(false);
let readyFrame = null;
let apiPrefetchTimer = null;
let apiIdleRequest = null;
let apiPrefetchScheduled = false;
let cursor = null;

const handleContextMenu = (event) => {
  event.preventDefault();

  ElMessage({
    message:
      "为了浏览体验，本站禁用右键",
    grouping: true,
    duration: 2000,
  });
};

const handleMouseDown = (event) => {
  if (event.button !== 1) {
    return;
  }

  store.backgroundShow =
    !store.backgroundShow;

  ElMessage({
    message:
      `已${
        store.backgroundShow
          ? "开启"
          : "退出"
      }壁纸展示状态`,
    grouping: true,
  });
};
const scheduleApiPrefetch = () => {
  if (apiPrefetchScheduled) {
    return;
  }

  apiPrefetchScheduled = true;

  /*
    背景已经完成以后，
    再额外让出 500ms。

    API 数据是整个首页最低优先级。
  */
  apiPrefetchTimer =
    window.setTimeout(() => {
      const runPrefetch =
        () => {
          prefetchHomeApis()
            .then((results) => {
              console.log(
                "低优先级 API 预加载完成",
                results,
              );
            });
        };

      if (
        "requestIdleCallback"
        in window
      ) {
        apiIdleRequest =
          window.requestIdleCallback(
            runPrefetch,
            {
              timeout: 4000,
            },
          );

        return;
      }

      runPrefetch();
    }, 500);
};
// 页面宽度
const getWidth = () => {
  store.setInnerWidth(window.innerWidth);
};

/*
  手机版：

  ☰ = 进入功能区
  × = 回到梦幻空白首页

  特别注意：
  这里绝不修改 activeRightPanel。

  因此：
  项目 → × → 首页 → ☰
  仍然回到项目。
*/
const toggleMobilePanel = () => {
  if (store.getInnerWidth >= 721) {
    return;
  }

  /*
    右页已经打开：
    底部按钮现在是 ×。

    × 只负责关闭右页，
    不修改 activeRightPanel。
  */
  if (store.mobileOpenState) {
    store.mobileOpenState = false;
    store.boxOpenState = false;
    return;
  }

  /*
    当前是左页：
    底部 ☰ 是“时间 / 天气”的专属入口。
  */
  store.activeRightPanel = "default";
  store.boxOpenState = false;
  store.mobileOpenState = true;
};

// 背景加载完成
const loadComplete = () => {
  nextTick(() => {
    helloInit();
    checkDays();
  });

  /*
    Background 已经完成，
    这时才安排 API 预加载。
  */
  scheduleApiPrefetch();
};

/*
  响应式状态调整。

  关键修改：
  进入手机版时不再重置 activeRightPanel。
*/
watch(
  () => store.innerWidth,
  (value) => {
    if (value < 721) {
      /*
        手机模式：

        五个功能页保留当前选择。
      */
      store.boxOpenState = false;
      store.setOpenState = false;

      return;
    }

    /*
      回到桌面模式：
      手机左右页状态失效。
    */
    store.mobileOpenState = false;

    /*
      如果手机上原来停留在项目 / 技术等页面，
      转成桌面后将它转换成桌面展开状态。
    */
    store.boxOpenState =
      store.activeRightPanel !== "default";
  },
);

onMounted(() => {
  readyFrame =
    window.requestAnimationFrame(() => {
      appReady.value = true;
    });

  // 仅为鼠标等精细指针启用自定义光标。
  if (
    window.matchMedia(
      "(pointer: fine)",
    ).matches
  ) {
    cursor = cursorInit();
  }

  document.addEventListener(
    "contextmenu",
    handleContextMenu,
  );

  window.addEventListener(
    "mousedown",
    handleMouseDown,
  );

  getWidth();

  window.addEventListener(
    "resize",
    getWidth,
  );

  // 控制台输出
  const styleTitle1 =
    "font-size: 20px;font-weight: 600;color: rgb(244,167,89);";

  const styleTitle2 =
    "font-size:12px;color: rgb(244,167,89);";

  const styleContent =
    "color: rgb(30,152,255);";

  const title1 =
    "無名の主页";

  const title2 = `
 _____ __  __  _______     ____     __
|_   _|  \\/  |/ ____\\ \\   / /\\ \\   / /
  | | | \\  / | (___  \\ \\_/ /  \\ \\_/ /
  | | | |\\/| |\\___ \\  \\   /    \\   /
 _| |_| |  | |____) |  | |      | |
|_____|_|  |_|_____/   |_|      |_|`;

  const content =
    `\n\n版本: ${config.version}` +
    `\n主页: ${config.home}` +
    `\nGithub: ${config.github}`;

  console.info(
    `%c${title1} %c${title2} %c${content}`,
    styleTitle1,
    styleTitle2,
    styleContent,
  );
});

onBeforeUnmount(() => {
  window.removeEventListener(
    "resize",
    getWidth,
  );

  window.removeEventListener(
    "mousedown",
    handleMouseDown,
  );

  document.removeEventListener(
    "contextmenu",
    handleContextMenu,
  );

  cursor?.destroy();

  if (readyFrame !== null) {
    window.cancelAnimationFrame(
      readyFrame,
    );
  }
  if (apiPrefetchTimer) {
    window.clearTimeout(
      apiPrefetchTimer,
    );
  }

  if (
    apiIdleRequest !== null &&
    "cancelIdleCallback" in window
  ) {
    window.cancelIdleCallback(
      apiIdleRequest,
    );
  }
});
</script>

<style lang="scss" scoped>
#main {
  width: 100%;

  position: relative;

  z-index: 2;

  transform: scale(1.2);

  transition:
    transform 0.3s;

  animation:
    fade-blur-main-in
    0.65s
    cubic-bezier(
      0.25,
      0.46,
      0.45,
      0.94
    )
    forwards;

  .container {
    width: 100%;
    height: 100%;

    margin: 0 auto;

    padding: 0 0.5vw;

    .all {
      width: 100%;
      height: 100%;

      padding:
        0 0.75rem;

      display: flex;

      flex-direction: row;

      justify-content: center;

      align-items: center;
    }

    .more {
      position: fixed;

      top: 0;
      left: 0;

      width: 100%;
      height: 100%;

      background-color:
        #00000080;

      backdrop-filter:
        blur(20px);

      z-index: 2;

      animation:
        fade 0.5s;
    }

    @media (
      max-width: 1200px
    ) {
      padding:
        0 2vw;
    }
  }

  @media (
    max-height: 720px
  ) {
    overflow-y: auto;
    overflow-x: hidden;

    .container {
      height: 721px;

      .more {
        height: 721px;

        width:
          calc(
            100% + 6px
          );
      }

      @media (
        min-width: 391px
      ) {
        padding-left: 0.7vw;
        padding-right: 0.25vw;

        @media (
          max-width: 1200px
        ) {
          padding-left: 2.3vw;
          padding-right: 1.75vw;
        }

        @media (
          max-width: 1100px
        ) {
          padding-left: 2vw;

          padding-right:
            calc(
              2vw - 6px
            );
        }

        @media (
          max-width: 992px
        ) {
          padding-left: 2.3vw;
          padding-right: 1.7vw;
        }

        @media (
          max-width: 900px
        ) {
          padding-left: 2vw;

          padding-right:
            calc(
              2vw - 6px
            );
        }
      }
    }

  }

  @media (
    max-width: 390px
  ) {
    overflow-x: auto;

    .container {
      width: 391px;
    }

    @media (
      min-height: 721px
    ) {
      overflow-y: hidden;
    }
  }
}

.menu {
  position: fixed;

  left: 50%;
  bottom:
    calc(
      64px +
        env(safe-area-inset-bottom)
    );

  width: 56px;
  height: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  transform:
    translateX(-50%);

  background:
    rgb(
      0 0 0 / 20%
    );

  backdrop-filter:
    blur(10px);

  border-radius: 6px;

  z-index: 11;

  transition:
    transform 0.3s;

  animation:
    fade 0.5s;

  &:active {
    transform:
      translateX(-50%)
      scale(0.95);
  }

  .i-icon {
    transform:
      translateY(2px);
  }

  @media (
    min-width: 721px
  ) {
    display: none;
  }
}
</style>
