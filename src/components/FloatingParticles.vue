<template>
  <div class="floating-particles" aria-hidden="true">
    <span
      v-for="particle in particles"
      :key="particle.id"
      :class="['particle', particle.kind]"
      :style="particle.style"
    />
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

const viewportWidth = ref(typeof window !== "undefined" ? window.innerWidth : 1920);
const viewportHeight = ref(typeof window !== "undefined" ? window.innerHeight : 1080);
const reducedMotion = ref(false);

const palette = [
  "rgba(255,255,255,0.58)",
  "rgba(155,180,255,0.42)",
  "rgba(255,215,235,0.34)",
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const seededValue = (index, salt = 0) => {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const getParticleCount = () => {
  const width = viewportWidth.value;
  const height = viewportHeight.value;
  const area = width * height;
  const baseArea = 1920 * 1080;
  const baseCount = 40;
  let count = Math.round(baseCount * Math.sqrt(area / baseArea));

  if (reducedMotion.value) {
    return clamp(Math.round(count * 0.2), 6, 10);
  }

  if (width < 721) {
    return clamp(count, 20, 26);
  }
  if (width < 1200) {
    return clamp(count, 32, 40);
  }
  if (width < 1800) {
    return clamp(count, 40, 46);
  }
  if (width < 2560) {
    return clamp(count, 36, 52);
  }
  return clamp(Math.max(count, 58), 58, 74);
};

const createParticle = (index, total) => {
  const columns = Math.max(4, Math.ceil(Math.sqrt(total)));
  const rows = Math.max(3, Math.ceil(total / columns));
  const column = index % columns;
  const row = Math.floor(index / columns);

  const xBase = -20 + (column / Math.max(1, columns - 1)) * 120;
  const yBase = -20 + (row / Math.max(1, rows - 1)) * 100;
  const xOffset = (seededValue(index, 1) - 0.5) * 16;
  const yOffset = (seededValue(index, 2) - 0.5) * 16;
  const left = clamp(xBase + xOffset, -20, 100);
  const top = clamp(yBase + yOffset, -20, 80);

  const xStart = -8 + (seededValue(index, 3) - 0.5) * 6;
  const yStart = -10 + (seededValue(index, 4) - 0.5) * 6;
  const xMid = 2 + (seededValue(index, 5) - 0.5) * 8;
  const yMid = 40 + (seededValue(index, 6) - 0.5) * 14;
  const xEnd = 18 + (seededValue(index, 7) - 0.5) * 12;
  const yEnd = 110 + (seededValue(index, 8) - 0.5) * 10;

  const bright = index % 11 === 0 || seededValue(index, 9) > 0.84;
  const size = bright ? 18 + Math.round(seededValue(index, 10) * 4) : 6 + Math.round(seededValue(index, 10) * 16);
  const opacity = bright ? 0.46 + seededValue(index, 11) * 0.12 : 0.22 + seededValue(index, 11) * 0.28;
  const blur = 1.5 + seededValue(index, 12) * 4.5;
  const duration = 14 + seededValue(index, 13) * 18;
  const delay = -(seededValue(index, 14) * duration);
  const rotateStart = Math.round(seededValue(index, 15) * 60 - 30);
  const rotateMid = rotateStart + 120 + Math.round(seededValue(index, 16) * 36);
  const rotateEnd = rotateStart + 260 + Math.round(seededValue(index, 17) * 40);
  const kind = seededValue(index, 18) > 0.55 ? "petal" : "orb";

  return {
    id: index + 1,
    kind,
    style: {
      left: `${left.toFixed(2)}vw`,
      top: `${top.toFixed(2)}vh`,
      "--x-start": `${xStart.toFixed(2)}vw`,
      "--y-start": `${yStart.toFixed(2)}vh`,
      "--x-mid": `${xMid.toFixed(2)}vw`,
      "--y-mid": `${yMid.toFixed(2)}vh`,
      "--x-end": `${xEnd.toFixed(2)}vw`,
      "--y-end": `${yEnd.toFixed(2)}vh`,
      "--size": `${size}px`,
      "--opacity": opacity.toFixed(2),
      "--blur": `${blur.toFixed(2)}px`,
      "--duration": `${duration.toFixed(2)}s`,
      "--delay": `${delay.toFixed(2)}s`,
      "--rotate-start": `${rotateStart}deg`,
      "--rotate-mid": `${rotateMid}deg`,
      "--rotate-end": `${rotateEnd}deg`,
      "--color": palette[index % palette.length],
    },
  };
};

const particleCount = computed(() => getParticleCount());
const particles = computed(() =>
  Array.from({ length: particleCount.value }, (_, index) => createParticle(index, particleCount.value)),
);

const updateViewport = () => {
  viewportWidth.value = window.innerWidth;
  viewportHeight.value = window.innerHeight;
};

const updateReducedMotion = (event) => {
  reducedMotion.value = event.matches;
};

let reducedMotionQuery = null;

onMounted(() => {
  updateViewport();
  window.addEventListener("resize", updateViewport, { passive: true });

  if (window.matchMedia) {
    reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.value = reducedMotionQuery.matches;
    if (reducedMotionQuery.addEventListener) {
      reducedMotionQuery.addEventListener("change", updateReducedMotion);
    } else if (reducedMotionQuery.addListener) {
      reducedMotionQuery.addListener(updateReducedMotion);
    }
  }
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateViewport);
  if (reducedMotionQuery?.removeEventListener) {
    reducedMotionQuery.removeEventListener("change", updateReducedMotion);
  } else if (reducedMotionQuery?.removeListener) {
    reducedMotionQuery.removeListener(updateReducedMotion);
  }
});
</script>

<style lang="scss" scoped>
.floating-particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
  mix-blend-mode: screen;
}

.particle {
  position: absolute;
  display: block;
  width: var(--size);
  height: var(--size);
  opacity: 0;
  filter: blur(var(--blur));
  will-change: transform, opacity;
  animation: drift-diagonal var(--duration) ease-in-out infinite;
  animation-delay: var(--delay);
  transform: translate3d(var(--x-start), var(--y-start), 0) rotate(var(--rotate-start));
  background: radial-gradient(
    circle at 35% 35%,
    var(--color) 0%,
    rgba(255, 255, 255, 0.16) 58%,
    transparent 76%
  );
}

.particle.orb {
  border-radius: 50%;
  box-shadow: 0 0 22px rgba(155, 180, 255, 0.16);
}

.particle.petal {
  border-radius: 999px 999px 70% 70% / 70% 70% 32% 32%;
  background: linear-gradient(135deg, var(--color), rgba(255, 255, 255, 0.06));
  box-shadow: 0 0 18px rgba(255, 215, 235, 0.1);
}

.particle:nth-child(3n) {
  border-radius: 60% 40% 70% 30% / 55% 45% 55% 45%;
}

.particle:nth-child(4n) {
  border-radius: 42% 58% 64% 36% / 54% 46% 54% 46%;
}

.particle:nth-child(5n) {
  background: radial-gradient(
    circle at 30% 30%,
    rgba(255, 255, 255, 0.78) 0%,
    rgba(255, 255, 255, 0.18) 54%,
    transparent 76%
  );
}

.particle:nth-child(7n) {
  background: radial-gradient(
    circle at 35% 35%,
    rgba(155, 180, 255, 0.72) 0%,
    rgba(155, 180, 255, 0.12) 56%,
    transparent 76%
  );
}

.particle:nth-child(11n) {
  background: radial-gradient(
    circle at 35% 35%,
    rgba(255, 215, 235, 0.72) 0%,
    rgba(255, 215, 235, 0.12) 58%,
    transparent 78%
  );
}

@keyframes drift-diagonal {
  0% {
    opacity: 0;
    transform: translate3d(var(--x-start), var(--y-start), 0) rotate(var(--rotate-start));
  }

  10% {
    opacity: var(--opacity);
  }

  42% {
    transform: translate3d(var(--x-mid), var(--y-mid), 0) rotate(var(--rotate-mid));
  }

  85% {
    opacity: var(--opacity);
    transform: translate3d(var(--x-end), var(--y-end), 0) rotate(var(--rotate-end));
  }

  100% {
    opacity: 0;
    transform: translate3d(calc(var(--x-end) + 8vw), calc(var(--y-end) + 10vh), 0) rotate(calc(var(--rotate-end) + 30deg));
  }
}

@media (prefers-reduced-motion: reduce) {
  .particle {
    animation: none;
    opacity: 0.2;
    transform: translate3d(var(--x-start), var(--y-start), 0);
  }

  .particle:nth-child(n + 9) {
    display: none;
  }
}
</style>
