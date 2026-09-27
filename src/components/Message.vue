<template>
  <div class="message">
    <!-- Logo / Title -->
    <div class="logo">
      <img
        v-if="siteLogo"
        class="logo-img"
        :src="siteLogo"
        alt="logo"
      />

      <div class="name">
        <span class="bg">
          梦幻空白
        </span>
      </div>
    </div>

    <!--
      整张简介卡：
      默认进入时光胶囊
    -->
    <div
      class="description cards"
    >
      <button
        type="button"
        class="description-trigger"
        aria-label="打开时光胶囊"
        @click="changeBox"
      ></button>

      <div class="content">
        <div class="text">
          <p class="portal-title">
            Forever Fantasy
          </p>

          <p class="portal-subtitle">
            已然遥远的空白幻想之城
          </p>

          <p class="portal-description">
            A quiet archive for projects, notes, and fragments.
          </p>

          <div class="tag-list">
            <button
              type="button"
              class="tag-pill"
              @click.stop="
                changePanel(
                  'projects'
                )
              "
            >
              项目列表
            </button>

            <button
              type="button"
              class="tag-pill"
              @click.stop="
                changePanel(
                  'notes'
                )
              "
            >
              技术笔记
            </button>

            <button
              type="button"
              class="tag-pill"
              @click.stop="
                changePanel(
                  'thoughts'
                )
              "
            >
              所见所感
            </button>
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
        &gt;&gt;
        进入我的世界
        &lt;&lt;
      </a>
    </div>
  </div>
</template>

<script setup>
import { mainStore } from "@/store";

const store = mainStore();

const siteLogo =
  import.meta.env
    .VITE_SITE_MAIN_LOGO ||
  "/images/icon/logo.png";

/*
  五平级模型中的直接入口。

  桌面：
  打开右侧扩展面板。

  手机：
  进入功能区，并直接显示对应页面。
*/
const changePanel = (
  panel,
) => {
  store.activeRightPanel =
    panel;

  if (
    store.getInnerWidth >=
    721
  ) {
    store.boxOpenState = true;

    return;
  }

  store.boxOpenState = false;

  store.mobileOpenState = true;
};

/*
  Forever Fantasy 卡片
  对应时光胶囊。
*/
const changeBox = () => {
  if (
    store.getInnerWidth >=
    721
  ) {
    const capsuleIsOpen =
      store.boxOpenState &&
      store.activeRightPanel ===
        "capsule";

    if (capsuleIsOpen) {
      store.activeRightPanel =
        "default";

      store.boxOpenState =
        false;
    } else {
      store.activeRightPanel =
        "capsule";

      store.boxOpenState =
        true;
    }

    return;
  }

  /*
    手机版：
    时光胶囊只是五个平级页面之一。
  */
  store.activeRightPanel =
    "capsule";

  store.boxOpenState = false;

  store.mobileOpenState = true;
};
</script>

<style lang="scss" scoped>
.message {
  .logo {
    display: flex;

    flex-direction: row;

    align-items: center;

    animation:
      fade 0.5s;

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

      font-family:
        system-ui,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;

      .bg {
        font-family:
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;

        font-size: 4rem;

        line-height: 1.1;

        color: #f9f9ff;

        font-weight: 800;

        letter-spacing:
          0.04em;

        text-shadow:
          0 8px 28px
          rgba(
            0,
            0,
            0,
            0.45
          );
      }
    }
  }

  .description {
    position: relative;

    width: 100%;

    max-width: 500px;

    padding:
      1.6rem 1.5rem;

    margin-top: 2.4rem;

    animation:
      fade 0.5s;

    cursor: pointer;

    border-radius: 10px;

    background:
      rgba(
        255,
        255,
        255,
        0.68
      );

    border:
      1px solid
      rgba(
        255,
        255,
        255,
        0.55
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

    transition:
      transform
        0.25s ease,
      background-color
        0.25s ease,
      border-color
        0.25s ease;

    &:hover {
      transform:
        translateY(-2px);

      background:
        rgba(
          255,
          255,
          255,
          0.76
        );

      border-color:
        rgba(
          255,
          255,
          255,
          0.72
        );
    }

    .description-trigger {
      position: absolute;
      inset: 0;

      width: 100%;
      height: 100%;

      padding: 0;

      appearance: none;

      border: 0;
      border-radius: inherit;

      background: transparent;

      color: inherit;
      font: inherit;

      cursor: pointer;

      &:focus-visible {
        outline:
          3px solid
          rgba(
            79,
            124,
            255,
            0.72
          );

        outline-offset: 3px;
      }
    }

    .content {
      position: relative;

      pointer-events: none;

      display: block;

      .text {
        margin: 0;

        transition:
          opacity 0.2s;

        font-family:
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;

        .portal-title {
          font-size: 2rem;

          line-height: 1.2;

          margin-bottom:
            0.8rem;

          color: #172033;

          font-weight: 800;
        }

        .portal-subtitle {
          font-size:
            1.08rem;

          line-height: 1.7;

          color:
            rgba(
              23,
              32,
              51,
              0.86
            );

          font-weight: 700;

          max-width: 440px;
        }

        .portal-description {
          margin-top:
            0.55rem;

          font-size:
            0.98rem;

          line-height: 1.7;

          color:
            rgba(
              23,
              32,
              51,
              0.72
            );

          font-weight: 600;

          max-width: 440px;
        }

        .tag-list {
          margin-top:
            0.9rem;

          display: flex;

          flex-wrap: wrap;

          gap: 0.55rem;
        }

        .tag-pill {
          position: relative;

          display:
            inline-flex;

          align-items:
            center;

          justify-content:
            center;

          padding:
            0.42rem
            0.8rem;

          appearance: none;

          border-radius:
            999px;

          background:
            rgba(
              224,
              235,
              255,
              0.72
            );

          border:
            1px solid
            rgba(
              145,
              176,
              255,
              0.3
            );

          color:
            rgba(
              35,
              52,
              86,
              0.86
            );

          font-size:
            0.82rem;

          font-family: inherit;

          font-weight: 700;

          letter-spacing:
            0.02em;

          box-shadow:
            inset
            0 1px 0
            rgba(
              255,
              255,
              255,
              0.65
            );

          cursor: pointer;

          pointer-events: auto;

          touch-action:
            manipulation;

          &:focus-visible {
            outline:
              3px solid
              rgba(
                79,
                124,
                255,
                0.72
              );

            outline-offset: 2px;
          }
        }
      }
    }
  }

  .actions {
    margin-top: 1.5rem;

    max-width: 500px;

    .primary-btn {
      display:
        inline-flex;

      align-items: center;

      justify-content:
        center;

      width: 100%;

      min-height: 54px;

      background:
        rgba(
          86,
          124,
          255,
          0.94
        );

      color: #fff;

      border-radius:
        999px;

      font-weight: 800;

      letter-spacing:
        0.04em;

      transition:
        transform
          0.2s ease,
        background
          0.2s ease,
        box-shadow
          0.2s ease,
        filter
          0.2s ease;

      text-decoration:
        none;

      position: relative;

      overflow: hidden;

      box-shadow:
        0 16px 40px
          rgba(
            45,
            83,
            220,
            0.3
          ),
        0 0 0 1px
          rgba(
            255,
            255,
            255,
            0.1
          )
          inset;

      &::before {
        content: "";

        position:
          absolute;

        inset:
          -35%
          auto
          -35%
          -60%;

        width: 35%;

        background:
          linear-gradient(
            120deg,
            transparent
              0%,
            rgba(
                255,
                255,
                255,
                0.38
              )
              50%,
            transparent
              100%
          );

        transform:
          translateX(
            -240%
          )
          skewX(
            -20deg
          );

        transition:
          transform
          0.55s
          cubic-bezier(
            0.22,
            1,
            0.36,
            1
          );

        pointer-events:
          none;
      }
    }

    .primary-btn:hover {
      transform:
        translateY(-1px);

      background:
        rgba(
          113,
          150,
          255,
          0.98
        );

      box-shadow:
        0 18px 42px
          rgba(
            45,
            83,
            220,
            0.38
          ),
        0 0 18px
          rgba(
            106,
            144,
            255,
            0.28
          );

      text-decoration:
        none;

      &::before {
        transform:
          translateX(
            320%
          )
          skewX(
            -20deg
          );
      }
    }

    .primary-btn:active {
      transform:
        translateY(1px);
    }
  }

  @media (
    max-width: 720px
  ) {
    .logo {
      max-width: 100%;

      .logo-img {
        width: 88px;

        height: 88px;
      }

      .name {
        padding-left:
          18px;

        .bg {
          font-size:
            2.8rem;
        }
      }
    }

    .description {
      max-width: 100%;

      margin-top: 2rem;

      padding:
        1.5rem
        1.3rem;

      /*
        手机版恢复交互。
      */
      pointer-events:
        auto;

      touch-action:
        manipulation;

      .content {
        .text {
          .portal-title {
            font-size:
              1.65rem;
          }

          .portal-subtitle {
            font-size:
              1rem;
          }

          .portal-description {
            font-size:
              0.95rem;
          }

          .tag-list {
            gap:
              0.45rem;
          }

          .tag-pill {
            font-size:
              0.78rem;

            padding:
              0.38rem
              0.72rem;
          }
        }
      }
    }

    .actions {
      max-width: 100%;

      .primary-btn {
        min-height:
          50px;
      }
    }
  }

  @media (
    max-width: 430px
  ) {
    .logo {
      .logo-img {
        width: 76px;

        height: 76px;
      }

      .name {
        padding-left:
          14px;

        .bg {
          font-size:
            2.2rem;
        }
      }
    }
  }
}
</style>
