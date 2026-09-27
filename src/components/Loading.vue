<template>
  <div
    id="loader-wrapper"
    :class="{ loaded }"
  >
    <div class="loader">
      <div class="loader-circle" />

      <div class="loader-text">
        <span class="name">
          {{ siteName }}
        </span>

        <span class="tip">
          加载中
        </span>
      </div>
    </div>

    <div class="loader-section section-left" />
    <div class="loader-section section-right" />
  </div>
</template>

<script setup>
defineProps({
  loaded: {
    type: Boolean,
    default: false,
  },
});

// 配置
const siteName = import.meta.env.VITE_SITE_NAME;
</script>

<style lang="scss" scoped>
#loader-wrapper {
  position: fixed;
  top: 0;
  left: 0;

  width: 100%;
  height: 100%;

  z-index: 999;
  overflow: hidden;

  .loader {
    width: 100%;
    height: 100%;

    position: absolute;
    top: 0;
    left: 0;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    z-index: 2;

    transition: opacity 0.18s ease-out;

    .loader-circle {
      width: 150px;
      height: 150px;

      border-radius: 50%;

      border: 3px solid transparent;
      border-top-color: #fff;

      animation: spin 1.8s linear infinite;

      z-index: 2;

      &:before {
        content: "";

        position: absolute;

        top: 5px;
        left: 5px;
        right: 5px;
        bottom: 5px;

        border-radius: 50%;

        border: 3px solid transparent;
        border-top-color: #a4a4a4;

        animation: spin-reverse 0.6s linear infinite;
      }

      &:after {
        content: "";

        position: absolute;

        top: 15px;
        left: 15px;
        right: 15px;
        bottom: 15px;

        border-radius: 50%;

        border: 3px solid transparent;
        border-top-color: #d3d3d3;

        animation: spin 1s linear infinite;
      }
    }

    .loader-text {
      display: flex;
      flex-direction: column;
      align-items: center;

      color: #fff;

      z-index: 2;

      margin-top: 40px;

      font-size: 24px;

      .tip {
        margin-top: 6px;

        font-size: 18px;
        opacity: 0.6;
      }
    }
  }

  .loader-section {
    position: fixed;
    top: 0;

    width: 51%;
    height: 100%;

    background: #333;

    z-index: 1;

    transition:
      transform 0.45s 0.08s
      cubic-bezier(0.645, 0.045, 0.355, 1);

    &.section-left {
      left: 0;
    }

    &.section-right {
      right: 0;
    }
  }

  /*
    页面首帧完成后立即开始退出。

    总时长大约 0.5 秒，
    不再人为等待 1 秒。
  */
  &.loaded {
    pointer-events: none;

    visibility: hidden;

    transition:
      visibility 0s 0.56s;

    .loader {
      opacity: 0;
    }

    .loader-section {
      &.section-left {
        transform: translateX(-100%);
      }

      &.section-right {
        transform: translateX(100%);
      }
    }
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes spin-reverse {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(-360deg);
  }
}
</style>