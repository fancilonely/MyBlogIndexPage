<template>
  <footer id="footer" :class="store.footerBlur ? 'blur' : null">
    <Transition name="fade" mode="out-in">
      <div v-if="!store.playerState || !store.playerLrcShow" class="power">
        <span>
          &copy; {{ fullYear }} &nbsp;Fancilonely&nbsp;&middot;&nbsp;Based on
          <a href="https://github.com/imsyy/home" target="_blank">imsyy/home</a>
        </span>
      </div>
      <div v-else class="lrc">
        <Transition name="fade" mode="out-in">
          <div class="lrc-all" :key="store.getPlayerLrc">
            <music-one theme="filled" size="18" fill="#efefef" />
            <span class="lrc-text text-hidden" v-html="store.getPlayerLrc" />
            <music-one theme="filled" size="18" fill="#efefef" />
          </div>
        </Transition>
      </div>
    </Transition>
  </footer>
</template>

<script setup>
import { MusicOne } from "@icon-park/vue-next";
import { mainStore } from "@/store";
import config from "@/../package.json";

const store = mainStore();
const fullYear = new Date().getFullYear();

// 加载配置数据
// const siteStartDate = ref(import.meta.env.VITE_SITE_START);
const startYear = ref(
  import.meta.env.VITE_SITE_START?.length >= 4 ? 
  import.meta.env.VITE_SITE_START.substring(0, 4) : null
);
const siteIcp = ref(import.meta.env.VITE_SITE_ICP);
const siteAuthor = ref(import.meta.env.VITE_SITE_AUTHOR);
const siteUrl = computed(() => {
  const url = import.meta.env.VITE_SITE_URL;
  if (!url) return "https://www.imsyy.top";
  // 判断协议前缀
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "//" + url;
  }
  return url;
});
</script>

<style lang="scss" scoped>
#footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 42px;
  line-height: 42px;
  text-align: center;
  z-index: 0;
  font-size: 14px;
  word-break: keep-all;
  white-space: nowrap;
  color: rgba(23, 32, 51, 0.82);
  background: rgba(255, 255, 255, 0.58);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.42);

  .power {
    animation: fade 0.3s;

    span {
      color: rgba(23, 32, 51, 0.82);
    }

    a {
      color: #4f7cff;
      text-decoration: none;
      font-weight: 600;

      &:hover {
        color: #2f5cff;
        text-decoration: underline;
      }
    }
  }

  .lrc {
    padding: 0 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: rgba(23, 32, 51, 0.82);

    .lrc-all {
      width: 98%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .lrc-text {
        margin: 0 8px;
        color: rgba(23, 32, 51, 0.82);
      }

      .i-icon {
        width: 18px;
        height: 18px;
        display: inherit;
      }
    }
  }

  &.blur {
    background: rgba(255, 255, 255, 0.58);
    backdrop-filter: blur(16px);
    font-size: 14px;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s ease-in-out;
  }

  @media (max-width: 720px) {
    font-size: 0.85rem;

    &.blur {
      font-size: 0.85rem;
    }
  }

  @media (max-width: 560px) {
    .c-hidden {
      display: none;
    }
  }

  @media (max-width: 480px) {
    .hidden {
      display: none;
    }
  }
}
</style>
