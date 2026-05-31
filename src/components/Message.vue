<template>
  <!-- 基本信息 -->
  <div class="message">
    <!-- Logo -->
    <div class="logo">
      <img v-if="siteLogo" class="logo-img" :src="siteLogo" alt="logo" />
      <div :class="{ name: true, 'text-hidden': true, long: siteUrl[0].length >= 6 }">
        <span class="bg">{{ descriptionText.hello }}</span>
        <span class="sm">{{ siteUrl[0] ? `.${siteUrl[1]}` : '' }}</span>
      </div>
    </div>
    <!-- 简介 -->
    <div class="description cards" @click="changeBox">
      <div class="content">
        <div class="text">
          <p class="portal-title">{{ descriptionText.text }}</p>
          <p class="portal-description">{{ descriptionSecondary }}</p>
          <p class="portal-note">{{ descriptionNote }}</p>
        </div>
      </div>
    </div>
    <div class="actions">
      <a
        class="primary-btn"
        href="https://www.fancivoid.asia"
        target="_blank"
        rel="noopener noreferrer"
      >
        Void Gate / Main Site
      </a>
      <div class="secondary-links">
        <a href="https://github.com/fancilonely" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="#">Project Archive (coming soon)</a>
        <a href="#">Research Notes (coming soon)</a>
        <a href="mailto:haotianzhu1115@foxmail.com">Signal Contact</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Error } from "@icon-park/vue-next";
import { mainStore } from "@/store";
const store = mainStore();

// 主页站点logo
const siteLogo = import.meta.env.VITE_SITE_MAIN_LOGO || "/images/icon/logo.png";
// 站点链接
const siteUrl = computed(() => {
  const url = import.meta.env.VITE_SITE_URL || "fancivoid.asia";
  if (url.startsWith("http://") || url.startsWith("https://")) {
    const urlFormat = url.replace(/^(https?:\/\/)/, "");
    return urlFormat.split(".");
  }
  return url.split(".");
});

// 简介区域文字
const descriptionText = reactive({
  hello: import.meta.env.VITE_DESC_HELLO || "FanciVoid",
  text:
    import.meta.env.VITE_DESC_TEXT ||
    "A personal digital space for projects, notes, and creative experiments.",
});
const descriptionSecondary =
  import.meta.env.VITE_DESC_HELLO_OTHER || "Enter the void.";
const descriptionNote =
  import.meta.env.VITE_DESC_TEXT_OTHER || "A quiet archive at the edge of the net.";

// 切换右侧功能区
const changeBox = () => {
  if (store.getInnerWidth >= 721) {
    store.boxOpenState = !store.boxOpenState;
  } else {
    ElMessage({
      message: "当前页面宽度不足以开启盒子",
      grouping: true,
      icon: h(Error, {
        theme: "filled",
        fill: "#efefef",
      }),
    });
  }
};

// 监听状态变化
watch(
  () => store.boxOpenState,
  (value) => {
    if (value) {
      descriptionText.hello = import.meta.env.VITE_DESC_HELLO_OTHER || "Enter the void.";
      descriptionText.text = import.meta.env.VITE_DESC_TEXT_OTHER || "Return anytime to explore the archive.";
    } else {
      descriptionText.hello = import.meta.env.VITE_DESC_HELLO || "FanciVoid";
      descriptionText.text =
        import.meta.env.VITE_DESC_TEXT ||
        "A personal digital space for projects, notes, and creative experiments.";
    }
  },
);
</script>

<style lang="scss" scoped>
.message {
  .logo {
    display: flex;
    flex-direction: row;
    align-items: center;
    animation: fade 0.5s;
    max-width: 460px;
    .logo-img {
      border-radius: 50%;
      width: 120px;
    }
    .name {
      width: 100%;
      padding-left: 22px;
      transform: translateY(-8px);
      font-family: "Pacifico-Regular";

      .bg {
        font-size: 5rem;
      }

      .sm {
        margin-left: 6px;
        font-size: 2rem;
        @media (min-width: 721px) and (max-width: 789px) {
          display: none;
        }
      }
    }
    @media (max-width: 768px) {
      .logo-img {
        width: 100px;
      }
      .name {
        height: 128px;
        .bg {
          font-size: 4.5rem;
        }
      }
    }

    @media (max-width: 720px) {
      max-width: 100%;
    }
  }

  .description {
    padding: 1.4rem 1.3rem;
    margin-top: 3rem;
    max-width: 480px;
    animation: fade 0.5s;
    border: 1px solid rgba(255, 255, 255, 0.08);
    background: rgba(6, 10, 22, 0.62);
    box-shadow: 0 24px 70px rgba(0, 0, 0, 0.28);
    backdrop-filter: blur(22px);
    transition: transform 0.25s ease, border-color 0.25s ease;

    &:hover {
      transform: translateY(-2px);
      border-color: rgba(115, 155, 255, 0.22);
    }

    .content {
      display: flex;
      justify-content: space-between;

      .text {
        margin: 0;
        line-height: 1.8;
        margin-right: auto;
        transition: opacity 0.2s;

        .portal-title {
          font-family: "Pacifico-Regular";
          font-size: 2.45rem;
          letter-spacing: 0.02em;
          margin-bottom: 0.6rem;
          color: #f9f9ff;
        }

        .portal-description {
          font-size: 1.05rem;
          color: #d7dbff;
          margin-bottom: 0.75rem;
          max-width: 360px;
        }

        .portal-note {
          font-size: 0.97rem;
          color: #90a3ff;
          opacity: 0.88;
        }
      }
    }
    @media (max-width: 720px) {
      max-width: 100%;
      pointer-events: none;
    }
  }
  .actions {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
    max-width: 480px;

    .primary-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      min-height: 52px;
      background: rgba(86, 124, 255, 0.92);
      color: #fff;
      border-radius: 999px;
      font-weight: 700;
      letter-spacing: 0.03em;
      transition: transform 0.2s ease, background 0.2s ease;
      text-decoration: none;
    }

    .primary-btn:hover {
      transform: translateY(-1px);
      background: rgba(106, 144, 255, 0.98);
    }

    .secondary-links {
      display: flex;
      flex-wrap: wrap;
      gap: 0.8rem;
    }

    .secondary-links a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 140px;
      padding: 12px 18px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.14);
      background: rgba(9, 12, 28, 0.52);
      color: #d7dbff;
      text-decoration: none;
      transition: background 0.25s ease, transform 0.2s ease;
    }

    .secondary-links a:hover {
      transform: translateY(-1px);
      background: rgba(26, 32, 58, 0.8);
    }

    @media (max-width: 720px) {
      .secondary-links {
        flex-direction: column;
      }
      .secondary-links a {
        width: 100%;
        min-width: auto;
      }
    }
  }
  // @media (max-width: 390px) {
  //   .logo {
  //     flex-direction: column;
  //     .logo-img {
  //       display: none;
  //     }
  //     .name {
  //       margin-left: 0;
  //       height: auto;
  //       transform: none;
  //       text-align: center;
  //       .bg {
  //         font-size: 3.5rem;
  //       }
  //       .sm {
  //         font-size: 1.4rem;
  //       }
  //     }
  //   }
  //   .description {
  //     margin-top: 2.5rem;
  //   }
  // }
}
</style>
