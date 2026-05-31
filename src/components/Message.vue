<template>
  <!-- 基本信息 -->
  <div class="message">
    <!-- Logo / Title -->
    <div class="logo">
      <img v-if="siteLogo" class="logo-img" :src="siteLogo" alt="logo" />
      <div class="name">
        <span class="bg">梦幻空白</span>
      </div>
    </div>

    <!-- 简介：点击后切换右侧时光胶囊 -->
    <div class="description cards" @click="changeBox">
      <div class="content">
        <div class="text">
          <p class="portal-title">Forever Fantasy</p>
          <p class="portal-description">已然遥远的空白幻想之城</p>
          <p class="portal-hint">
            {{ store.boxOpenState ? "点击返回时间面板" : "点击查看时光胶囊" }}
          </p>
        </div>
      </div>
    </div>

    <!-- 主入口 -->
    <div class="actions">
      <a
        class="primary-btn"
        href="https://www.fancivoid.asia"
        target="_blank"
        rel="noopener noreferrer"
      >
        &gt;&gt; 进入我的世界 &lt;&lt;
      </a>
    </div>
  </div>
</template>

<script setup>
import { ElMessage } from "element-plus";
import { Error } from "@icon-park/vue-next";
import { h } from "vue";
import { mainStore } from "@/store";

const store = mainStore();

// 主页站点 logo
const siteLogo = import.meta.env.VITE_SITE_MAIN_LOGO || "/images/icon/logo.png";

// 切换右侧功能区：桌面端切换，移动端提示
const changeBox = () => {
  if (store.getInnerWidth >= 721) {
    store.boxOpenState = !store.boxOpenState;
  } else {
    ElMessage({
      message: "当前页面宽度不足以开启盒子",
      grouping: true,
      icon: h(Error, {
        theme: "filled",
        fill: "#4f7cff",
      }),
    });
  }
};
</script>

<style lang="scss" scoped>
.message {
  .logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    animation: fade 0.5s;
    max-width: 560px;

    .logo-img {
      width: 112px;
      height: 112px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .name {
      width: auto;
      padding-left: 24px;
      transform: none;
      white-space: nowrap;
      overflow: visible;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

      .bg {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        font-size: 4rem;
        line-height: 1.1;
        color: #f9f9ff;
        font-weight: 800;
        letter-spacing: 0.04em;
        text-shadow: 0 8px 28px rgba(0, 0, 0, 0.45);
      }
    }
  }

  .description {
    width: 100%;
    max-width: 500px;
    padding: 1.8rem 1.6rem;
    margin-top: 2.4rem;
    animation: fade 0.5s;
    cursor: pointer;
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.68);
    border: 1px solid rgba(255, 255, 255, 0.55);
    box-shadow: 0 18px 50px rgba(35, 45, 80, 0.18);
    backdrop-filter: blur(16px);
    transition:
      transform 0.25s ease,
      background-color 0.25s ease,
      border-color 0.25s ease;

    &:hover {
      transform: translateY(-2px);
      background: rgba(255, 255, 255, 0.76);
      border-color: rgba(255, 255, 255, 0.72);
    }

    .content {
      display: block;

      .text {
        margin: 0;
        transition: opacity 0.2s;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

        .portal-title {
          font-size: 2.2rem;
          line-height: 1.2;
          margin-bottom: 0.8rem;
          color: #172033;
          font-weight: 800;
        }

        .portal-description {
          font-size: 1.25rem;
          line-height: 1.75;
          color: rgba(23, 32, 51, 0.82);
          font-weight: 600;
          max-width: 440px;
        }

        .portal-hint {
          margin-top: 0.8rem;
          font-size: 0.9rem;
          color: rgba(79, 124, 255, 0.88);
          font-weight: 700;
        }
      }
    }
  }

  .actions {
    margin-top: 1.5rem;
    max-width: 500px;

    .primary-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 54px;
      background: rgba(86, 124, 255, 0.94);
      color: #fff;
      border-radius: 999px;
      font-weight: 800;
      letter-spacing: 0.04em;
      transition:
        transform 0.2s ease,
        background 0.2s ease;
      text-decoration: none;
      box-shadow: 0 16px 40px rgba(45, 83, 220, 0.35);
    }

    .primary-btn:hover {
      transform: translateY(-1px);
      background: rgba(106, 144, 255, 0.98);
      text-decoration: none;
    }
  }

  @media (max-width: 720px) {
    .logo {
      max-width: 100%;

      .logo-img {
        width: 88px;
        height: 88px;
      }

      .name {
        padding-left: 18px;

        .bg {
          font-size: 2.8rem;
        }
      }
    }

    .description {
      max-width: 100%;
      margin-top: 2rem;
      padding: 1.5rem 1.3rem;
      pointer-events: none;

      .content {
        .text {
          .portal-title {
            font-size: 1.8rem;
          }

          .portal-description {
            font-size: 1.08rem;
            line-height: 1.7;
          }

          .portal-hint {
            display: none;
          }
        }
      }
    }

    .actions {
      max-width: 100%;

      .primary-btn {
        min-height: 50px;
      }
    }
  }

  @media (max-width: 430px) {
    .logo {
      .logo-img {
        width: 76px;
        height: 76px;
      }

      .name {
        padding-left: 14px;

        .bg {
          font-size: 2.2rem;
        }
      }
    }
  }
}
</style>