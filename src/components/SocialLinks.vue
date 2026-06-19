<template>
  <!-- 社交链接 -->
  <div class="social">
    <div class="link">
      <a
        v-for="item in socialLinks"
        :key="item.name"
        :href="item.url"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="item.name"
        @mouseenter="socialTip = item.tip"
        @mouseleave="socialTip = defaultTip"
      >
        <img class="icon" :src="item.icon" :alt="item.name" />
      </a>
    </div>

    <span class="tip">{{ socialTip }}</span>
  </div>
</template>

<script setup>
import { ref } from "vue";
import socialLinks from "@/assets/socialLinks.json";

const defaultTip = "通过这里联系我吧";
const socialTip = ref(defaultTip);
</script>

<style lang="scss" scoped>
.social {
  margin-top: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 460px;
  width: 100%;
  min-height: 40px;
  padding: 0 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.58);
  border: 1px solid rgba(255, 255, 255, 0.46);
  box-shadow: 0 12px 30px rgba(35, 45, 80, 0.1);
  backdrop-filter: blur(16px);
  animation: fade 0.5s;
  transition:
    background-color 0.3s,
    transform 0.3s,
    box-shadow 0.3s;

  &:hover {
    background: rgba(239, 245, 255, 0.72);
    transform: translateY(-1px);
    box-shadow: 0 16px 38px rgba(35, 45, 80, 0.14);
  }

  .link {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 6px;

    a {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      transition:
        transform 0.2s ease,
        background 0.2s ease;

      &:hover {
        background: rgba(79, 124, 255, 0.14);
        transform: translateY(-2px);
      }

      &:active {
        transform: translateY(-1px);
      }

      .icon {
        width: 20px;
        height: 20px;
        margin: 0;
        object-fit: contain;
        transition:
          transform 0.3s,
          filter 0.3s;
        filter: brightness(0) saturate(100%) invert(16%) sepia(17%) saturate(1060%)
          hue-rotate(185deg) brightness(92%) contrast(91%);
      }

      &:hover .icon {
        transform: scale(1.08);
      }
    }
  }

  .tip {
    margin-left: 12px;
    padding-left: 12px;
    border-left: 1px solid rgba(23, 32, 51, 0.16);
    color: rgba(23, 32, 51, 0.82);
    font-size: 0.92rem;
    font-weight: 600;
    white-space: nowrap;
    animation: fade 0.5s;
  }

  @media (max-width: 840px) {
    width: fit-content;
    max-width: 100%;
    justify-content: flex-start;
    padding: 0 8px;

    .tip {
      display: none;
    }
  }
}
</style>