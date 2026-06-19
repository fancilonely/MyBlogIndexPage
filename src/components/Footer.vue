<template>
  <footer id="footer" :class="store.footerBlur ? 'blur' : null">
    <Transition name="fade" mode="out-in">
      <div v-if="!store.playerState || !store.playerLrcShow" class="power">
        <!-- Edit this footer text to add ICP filing number or custom copyright text. -->
        <span>
          © 2026 梦幻空白 · Based on
          <a
            href="https://github.com/imsyy/home"
            target="_blank"
            rel="noopener noreferrer"
          >
            imsyy/home
          </a>
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

const store = mainStore();
</script>

<style lang="scss" scoped>
#footer {
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  min-height: 42px;
  line-height: 42px;
  text-align: center;
  z-index: 3;
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
      font-weight: 600;
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

  @media (max-width: 720px) {
    .power {
      padding: 0 12px;
      line-height: 1.3;
      white-space: normal;
    }
  }
}
</style>
