<template>
  <div :class="store.backgroundShow ? 'cover show' : 'cover'">
    <img
      :src="bgUrl"
      :class="['bg', { loaded: bgLoaded }]"
      alt="cover"
      @load="imgLoadComplete"
      @error.once="imgLoadError"
      @animationend="imgAnimationEnd"
    />

    <!-- 浅色柔和遮罩 -->
    <div :class="store.backgroundShow ? 'overlay hidden' : 'overlay'" />

    <Transition name="fade" mode="out-in">
      <a
        v-if="store.backgroundShow && bgLoaded"
        class="down"
        :href="bgUrl"
        target="_blank"
        rel="noopener noreferrer"
      >
        下载壁纸
      </a>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, h } from "vue";
import { ElMessage } from "element-plus";
import { mainStore } from "@/store";
import { Error } from "@icon-park/vue-next";

const store = mainStore();

const bgUrl = ref(null);

/*
  背景图片状态现在只属于 Background.vue 自己。

  不再使用：
  store.imgLoadStatus

  因此背景图片不会控制整个站点是否显示。
*/
const bgLoaded = ref(false);

const emit = defineEmits(["loadComplete"]);

let loadCompleteEmitted = false;

// 使用本地 WebP 背景，避免阻塞外部图片请求。
const bgPath = "/images/background1.webp";

// 固定加载单张背景
const changeBg = () => {
  bgLoaded.value = false;
  bgUrl.value = bgPath;
};

// 只允许发送一次加载完成事件
const emitLoadComplete = () => {
  if (loadCompleteEmitted) {
    return;
  }

  loadCompleteEmitted = true;
  emit("loadComplete");
};

// 图片下载完成
const imgLoadComplete = () => {
  /*
    不再：
    setTimeout(..., 300)
    不再：
    store.setImgLoadStatus(true)

    这里只负责告诉背景：
    图片已经可以显示。
  */
  bgLoaded.value = true;
};

// 背景淡入动画结束
const imgAnimationEnd = () => {
  console.log("壁纸加载且动画完成");
  emitLoadComplete();
};

// 图片显示失败
const imgLoadError = () => {
  console.error("壁纸加载失败：", bgUrl.value);

  /*
    即使背景图片失败，
    主页面仍然可以正常工作，
    使用 .cover 自带的浅色背景。
  */
  bgLoaded.value = false;

  ElMessage({
    message: "壁纸加载失败，已使用默认背景",
    icon: h(Error, {
      theme: "filled",
      fill: "#4f7cff",
    }),
  });

  emitLoadComplete();
};

onMounted(() => {
  changeBg();
});
</script>

<style lang="scss" scoped>
.cover {
  position: fixed;
  inset: 0;

  width: 100%;
  height: 100%;

  transition: 0.25s;

  z-index: 0;
  overflow: hidden;

  /*
    背景图片还没到的时候，
    用户先看到这一层浅色底色。
  */
  background: #f4f6fb;

  &.show {
    z-index: 1;
  }

  .bg {
    position: absolute;
    inset: 0;

    width: 100%;
    height: 100%;

    object-fit: cover;
    object-position: center;

    backface-visibility: hidden;

    /*
      图片没加载完成之前保持透明。
      页面主体已经可以正常显示。
    */
    opacity: 0;

    filter:
      blur(12px)
      brightness(0.9)
      saturate(1.02);

    transform: scale(1.08);

    /*
      图片下载完成以后，
      Vue 添加 loaded class，
      此时才开始背景淡入。
    */
    &.loaded {
      animation: bg-soft-in 0.7s
        cubic-bezier(0.25, 0.46, 0.45, 0.94)
        forwards;
    }
  }

  .overlay {
    opacity: 1;

    position: absolute;
    inset: 0;

    width: 100%;
    height: 100%;

    background:
      linear-gradient(
        90deg,
        rgba(244, 246, 251, 0.12) 0%,
        rgba(255, 255, 255, 0.04) 45%,
        rgba(255, 255, 255, 0.08) 100%
      ),
      linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.06) 0%,
        rgba(255, 255, 255, 0.02) 48%,
        rgba(244, 246, 251, 0.18) 100%
      );

    transition: opacity 1.2s ease;

    &.hidden {
      opacity: 0;
    }
  }

  .down {
    font-size: 15px;
    color: #172033;

    position: absolute;

    bottom: 30px;
    left: 0;
    right: 0;

    margin: 0 auto;
    padding: 10px 18px;

    border-radius: 999px;

    background: rgba(255, 255, 255, 0.66);
    border: 1px solid rgba(255, 255, 255, 0.55);

    box-shadow: 0 12px 32px rgba(35, 45, 80, 0.16);

    backdrop-filter: blur(16px);

    width: fit-content;
    min-width: 112px;
    height: 38px;

    display: flex;
    justify-content: center;
    align-items: center;

    text-decoration: none;
    font-weight: 700;

    &:hover {
      transform: translateY(-1px);
      background: rgba(255, 255, 255, 0.78);
      color: #4f7cff;
      text-decoration: none;
    }

    &:active {
      transform: translateY(0);
    }
  }
}

@keyframes bg-soft-in {
  from {
    opacity: 0;

    filter:
      blur(12px)
      brightness(0.9)
      saturate(1.02);

    transform: scale(1.08);
  }

  to {
    opacity: 1;

    filter:
      brightness(0.92)
      saturate(1.04)
      contrast(0.98);

    transform: scale(1.02);
  }
}
</style>
