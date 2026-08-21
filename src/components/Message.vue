<!-- src\components\Message.vue -->
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
          <p class="portal-subtitle">已然遥远的空白幻想之城</p>
          <p class="portal-description">A quiet archive for projects, notes, and fragments.</p>
          <div class="tag-list">
            <span
              class="tag-pill"
              @click.stop="changePanel('projects')"
            >
              项目列表
            </span>
            <span
              class="tag-pill"
              @click.stop="changePanel('notes')"
            >
              技术笔记
            </span>
            <span
              class="tag-pill"
              @click.stop="changePanel('thoughts')"
            >
              所见所感
            </span>
          </div>
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

const changePanel = (panel) => {
  if (store.getInnerWidth >= 721) {
    store.boxOpenState = false;
    store.activeRightPanel = panel;
  }
};
// 主页站点 logo
const siteLogo = import.meta.env.VITE_SITE_MAIN_LOGO || "/images/icon/logo.png";

const openCapsule = () => {
  if(store.getInnerWidth >= 721){
    store.activeRightPanel="capsule";
    store.boxOpenState=true;
  }
};
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
    padding: 1.6rem 1.5rem;
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
          font-size: 2rem;
          line-height: 1.2;
          margin-bottom: 0.8rem;
          color: #172033;
          font-weight: 800;
        }

        .portal-subtitle {
          font-size: 1.08rem;
          line-height: 1.7;
          color: rgba(23, 32, 51, 0.86);
          font-weight: 700;
          max-width: 440px;
        }

        .portal-description {
          margin-top: 0.55rem;
          font-size: 0.98rem;
          line-height: 1.7;
          color: rgba(23, 32, 51, 0.72);
          font-weight: 600;
          max-width: 440px;
        }

        .tag-list {
          margin-top: 0.9rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.55rem;
        }

        .tag-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.42rem 0.8rem;
          border-radius: 999px;
          background: rgba(224, 235, 255, 0.72);
          border: 1px solid rgba(145, 176, 255, 0.3);
          color: rgba(35, 52, 86, 0.86);
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.65);
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
        background 0.2s ease,
        box-shadow 0.2s ease,
        filter 0.2s ease;
      text-decoration: none;
      position: relative;
      overflow: hidden;
      box-shadow:
        0 16px 40px rgba(45, 83, 220, 0.3),
        0 0 0 1px rgba(255, 255, 255, 0.1) inset;

      &::before {
        content: "";
        position: absolute;
        inset: -35% auto -35% -60%;
        width: 35%;
        background: linear-gradient(120deg, transparent 0%, rgba(255, 255, 255, 0.38) 50%, transparent 100%);
        transform: translateX(-240%) skewX(-20deg);
        transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        pointer-events: none;
      }
    }

    .primary-btn:hover {
      transform: translateY(-1px);
      background: rgba(113, 150, 255, 0.98);
      box-shadow:
        0 18px 42px rgba(45, 83, 220, 0.38),
        0 0 18px rgba(106, 144, 255, 0.28);
      text-decoration: none;

      &::before {
        transform: translateX(320%) skewX(-20deg);
      }
    }

    .primary-btn:active {
      transform: translateY(1px);
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
            font-size: 1.65rem;
          }

          .portal-subtitle {
            font-size: 1rem;
          }

          .portal-description {
            font-size: 0.95rem;
          }

          .tag-list {
            gap: 0.45rem;
          }

          .tag-pill {
            font-size: 0.78rem;
            padding: 0.38rem 0.72rem;
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