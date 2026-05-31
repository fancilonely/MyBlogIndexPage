<template>
  <div :class="store.backgroundShow ? 'cover show' : 'cover'">
    <img
      v-show="store.imgLoadStatus"
      :src="bgUrl"
      class="bg"
      alt="cover"
      @load="imgLoadComplete"
      @error.once="imgLoadError"
      @animationend="imgAnimationEnd"
    />

    <!-- 浅色柔和遮罩：避免黑边，不做夜间压暗 -->
    <div :class="store.backgroundShow ? 'overlay hidden' : 'overlay'" />

    <Transition name="fade" mode="out-in">
      <a
        v-if="store.backgroundShow"
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
import { ref, onMounted, onBeforeUnmount, h } from "vue";
import { ElMessage } from "element-plus";
import { mainStore } from "@/store";
import { Error } from "@icon-park/vue-next";

const store = mainStore();
const bgUrl = ref(null);
const imgTimeout = ref(null);
const emit = defineEmits(["loadComplete"]);

// 固定本地背景图：替换图片时只需要覆盖 public/images/background1.jpg
const bgPath = "/images/background1.jpg";
const fallbackBg = "/images/background1.jpg";

// 固定加载单张背景
const changeBg = () => {
  bgUrl.value = bgPath;
};

// 图片加载完成
const imgLoadComplete = () => {
  imgTimeout.value = setTimeout(() => {
    store.setImgLoadStatus(true);
  }, 300);
};

// 图片动画完成
const imgAnimationEnd = () => {
  console.log("壁纸加载且动画完成");
  emit("loadComplete");
};

// 图片显示失败
const imgLoadError = () => {
  console.error("壁纸加载失败：", bgUrl.value);
  ElMessage({
    message: "壁纸加载失败，已临时切换回默认",
    icon: h(Error, {
      theme: "filled",
      fill: "#4f7cff",
    }),
  });
  bgUrl.value = fallbackBg;
};

onMounted(() => {
  changeBg();
});

onBeforeUnmount(() => {
  if (imgTimeout.value) clearTimeout(imgTimeout.value);
});
</script>

<style lang="scss" scoped>
.cover {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transition: 0.25s;
  z-index: -1;
  overflow: hidden;
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
      原版问题：
      brightness(0.25) 会把背景压得非常黑；
      这里改成轻微提亮、轻微柔化，适合浅色毛玻璃界面。
    */
    filter: brightness(0.92) saturate(1.04) contrast(0.98);
    transform: scale(1.02);

    transition:
      filter 0.3s ease,
      transform 0.3s ease;

    animation: bg-soft-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    animation-delay: 0.25s;
  }

  /*
    浅色遮罩：
    去掉黑色径向边缘，避免四周发黑。
    只保留很轻的白色雾面和底部柔和渐变，让浅色卡片更自然。
  */
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
    filter: blur(12px) brightness(0.9) saturate(1.02);
    transform: scale(1.08);
  }

  to {
    opacity: 1;
    filter: brightness(0.92) saturate(1.04) contrast(0.98);
    transform: scale(1.02);
  }
}
</style>