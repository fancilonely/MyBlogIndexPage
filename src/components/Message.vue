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

    <!-- 简介 -->
    <div class="description cards">
      <div class="content">
        <div class="text">
          <p class="portal-title">Forever Fantasy</p>
          <p class="portal-description">
            已然遥远的空白幻想之城
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
        >> 进入我的世界 <<
      </a>
    </div>
  </div>
</template>

<script setup>
// 主页站点 logo
const siteLogo = import.meta.env.VITE_SITE_MAIN_LOGO || "/images/icon/logo.png";
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

      .sm {
        display: none;
      }
    }
  }

  .description {
    width: 100%;
    max-width: 500px;
    padding: 1.8rem 1.6rem;
    margin-top: 2.4rem;
    animation: fade 0.5s;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(6, 10, 22, 0.68);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(22px);
    transition: transform 0.25s ease, border-color 0.25s ease;

    &:hover {
      transform: translateY(-2px);
      border-color: rgba(115, 155, 255, 0.22);
    }

    .content {
      display: block;

      .text {
        margin: 0;
        transition: opacity 0.2s;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

        .portal-title {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 2.2rem;
          line-height: 1.2;
          margin-bottom: 0.8rem;
          color: #ffffff;
          font-weight: 800;
        }

        .portal-description {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          font-size: 1.25rem;
          line-height: 1.75;
          color: rgba(255, 255, 255, 0.92);
          font-weight: 600;
          max-width: 440px;
        }

        .portal-note {
          display: none;
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
      transition: transform 0.2s ease, background 0.2s ease;
      text-decoration: none;
      box-shadow: 0 16px 40px rgba(45, 83, 220, 0.35);
    }

    .primary-btn:hover {
      transform: translateY(-1px);
      background: rgba(106, 144, 255, 0.98);
    }

    .secondary-links {
      display: none;
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

      .content {
        .text {
          .portal-title {
            font-size: 1.8rem;
          }

          .portal-description {
            font-size: 1.08rem;
            line-height: 1.7;
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