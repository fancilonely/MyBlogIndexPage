<template>
  <div
    class="weather-widget"
    aria-live="polite"
  >
    <div
      v-if="status === 'loading'"
      class="weather-state"
    >
      <span
        class="loading-dot"
        aria-hidden="true"
      ></span>

      <span>
        正在获取天气
      </span>
    </div>

    <div
      v-else-if="
        status === 'error'
      "
      class="
        weather-state
        weather-error
      "
    >
      <span>
        暂时无法获取天气
      </span>

      <button
        type="button"
        class="retry-button"
        @click="
          getWeatherData(true)
        "
      >
        重新获取
      </button>
    </div>

    <div
      v-else
      class="weather-content"
    >
      <div
        class="weather-primary"
      >
        <span
          class="weather-icon"
          aria-hidden="true"
        >
          {{ weatherIcon }}
        </span>

        <span
          class="temperature"
        >
          {{
            weatherData.temperature
          }}
          <small>℃</small>
        </span>

        <div
          class="weather-summary"
        >
          <span class="city">
            {{ weatherData.city }}
          </span>

          <span
            class="condition"
          >
            {{
              weatherData.condition
            }}
          </span>
        </div>
      </div>

      <div class="weather-meta">
        <span>
          {{
            formattedWindDirection
          }}
        </span>

        <span>
          {{
            weatherData.windDetail ||
            "风速未知"
          }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref,
} from "vue";

import {
  getCachedWeather,
  peekWeatherCache,
} from "@/utils/apiData.js";

const status =
  ref("loading");

const weatherData =
  reactive({
    city: "",
    condition: "",
    temperature: "",
    weatherCode: null,
    windDirection: "",
    windDetail: "",
  });

const applyWeather = (
  data,
) => {
  if (!data) {
    return;
  }

  weatherData.city =
    data.city || "未知地区";

  weatherData.condition =
    data.condition ||
    "天气未知";

  weatherData.temperature =
    data.temperature ?? "--";

  weatherData.weatherCode =
    data.weatherCode ?? null;

  weatherData.windDirection =
    data.windDirection || "";

  weatherData.windDetail =
    data.windDetail ||
    "风速未知";
};

const getWeatherData =
  async (
    force = false,
  ) => {
    /*
      如果已有缓存，
      刷新期间不要把已有天气
      换回 Loading。
    */
    const cached =
      peekWeatherCache();

    if (cached?.data) {
      applyWeather(
        cached.data,
      );

      status.value =
        "success";
    } else {
      status.value =
        "loading";
    }

    try {
      const result =
        await getCachedWeather({
          force,
        });

      applyWeather(result);

      status.value =
        "success";
    } catch (error) {
      console.error(
        "天气信息获取失败：",
        error,
      );

      /*
        只有真的连旧缓存都没有，
        才显示 error。
      */
      if (!cached?.data) {
        status.value =
          "error";
      }
    }
  };

const formattedWindDirection =
  computed(() => {
    const direction =
      weatherData.windDirection;

    if (!direction) {
      return "风向未知";
    }

    return direction.endsWith(
      "风",
    )
      ? direction
      : `${direction}风`;
  });

const weatherCodeGroups = {
  clear: new Set([
    1000,
  ]),

  cloud: new Set([
    1003,
    1006,
    1009,
  ]),

  fog: new Set([
    1030,
    1135,
    1147,
  ]),

  rain: new Set([
    1063,
    1150,
    1153,
    1180,
    1183,
    1186,
    1189,
    1192,
    1195,
    1240,
    1243,
    1246,
  ]),

  snow: new Set([
    1066,
    1069,
    1072,
    1114,
    1117,
    1168,
    1171,
    1198,
    1201,
    1204,
    1207,
    1210,
    1213,
    1216,
    1219,
    1222,
    1225,
    1237,
    1249,
    1252,
    1255,
    1258,
    1261,
    1264,
  ]),

  thunder: new Set([
    1087,
    1273,
    1276,
    1279,
    1282,
  ]),
};

const weatherIcon =
  computed(() => {
    const code =
      weatherData.weatherCode ===
      null
        ? null
        : Number(
            weatherData.weatherCode,
          );

    if (
      weatherCodeGroups.thunder
        .has(code)
    ) {
      return "ϟ";
    }

    if (
      weatherCodeGroups.snow
        .has(code)
    ) {
      return "❄";
    }

    if (
      weatherCodeGroups.rain
        .has(code)
    ) {
      return "☂";
    }

    if (
      weatherCodeGroups.fog
        .has(code)
    ) {
      return "≋";
    }

    if (
      weatherCodeGroups.cloud
        .has(code)
    ) {
      return "☁";
    }

    if (
      weatherCodeGroups.clear
        .has(code)
    ) {
      return "☀";
    }

    const condition =
      weatherData.condition;

    if (/雷/.test(condition)) {
      return "ϟ";
    }

    if (
      /雪|冰|雨夹雪/.test(
        condition,
      )
    ) {
      return "❄";
    }

    if (/雨/.test(condition)) {
      return "☂";
    }

    if (
      /雾|霾/.test(
        condition,
      )
    ) {
      return "≋";
    }

    if (
      /云|阴/.test(
        condition,
      )
    ) {
      return "☁";
    }

    if (/晴/.test(condition)) {
      return "☀";
    }

    return "◌";
  });

onMounted(() => {
  const cached =
    peekWeatherCache();

  /*
    有缓存：
    第一帧直接显示。
  */
  if (cached?.data) {
    applyWeather(
      cached.data,
    );

    status.value =
      "success";

    /*
      缓存过期：
      后台刷新，
      旧内容继续显示。
    */
    if (!cached.fresh) {
      getWeatherData(true);
    }

    return;
  }

  /*
    没缓存才真正等网络。
  */
  getWeatherData();
});
</script>

<style lang="scss" scoped>
.weather-widget {
  width: 100%;
  min-height: 76px;

  display: flex;

  align-items: center;

  justify-content: center;

  color: #172033;
}

.weather-state {
  min-height: 76px;

  display: flex;

  align-items: center;

  justify-content: center;

  gap: 0.65rem;

  color:
    rgba(
      23,
      32,
      51,
      0.62
    );

  font-size: 0.9rem;

  font-weight: 700;
}

.loading-dot {
  width: 9px;
  height: 9px;

  border-radius: 50%;

  background: #6f8eff;

  box-shadow:
    0 0 0
    rgba(
      111,
      142,
      255,
      0.5
    );

  animation:
    weather-pulse
    1.4s infinite;
}

.weather-error {
  flex-direction:
    column;

  gap: 0.5rem;
}

.retry-button {
  padding:
    0.32rem
    0.72rem;

  border:
    1px solid
    rgba(
      79,
      124,
      255,
      0.24
    );

  border-radius:
    999px;

  background:
    rgba(
      224,
      235,
      255,
      0.68
    );

  color:
    rgba(
      35,
      52,
      86,
      0.86
    );

  font: inherit;

  font-size:
    0.78rem;

  cursor: pointer;

  transition:
    transform
      0.2s ease,
    background
      0.2s ease;

  &:hover {
    transform:
      translateY(-1px);

    background:
      rgba(
        224,
        235,
        255,
        0.92
      );
  }
}

.weather-content {
  width: 100%;
}

.weather-primary {
  display: flex;

  align-items: center;

  justify-content:
    center;

  gap: 0.8rem;
}

.weather-icon {
  width: 42px;

  text-align: center;

  color: #5877d8;

  font-size: 2rem;

  line-height: 1;
}

.temperature {
  color: #172033;

  font-size: 2rem;

  line-height: 1;

  font-weight: 800;

  small {
    margin-left:
      0.1rem;

    font-size:
      0.8rem;

    color:
      rgba(
        23,
        32,
        51,
        0.58
      );
  }
}

.weather-summary {
  min-width: 0;

  display: flex;

  flex-direction:
    column;

  gap: 0.18rem;
}

.city {
  max-width: 180px;

  overflow: hidden;

  color:
    rgba(
      23,
      32,
      51,
      0.82
    );

  font-size: 0.9rem;

  font-weight: 800;

  text-overflow:
    ellipsis;

  white-space: nowrap;
}

.condition {
  color:
    rgba(
      23,
      32,
      51,
      0.62
    );

  font-size: 0.82rem;

  font-weight: 700;
}

.weather-meta {
  margin-top:
    0.75rem;

  display: flex;

  align-items: center;

  justify-content:
    center;

  gap: 1rem;

  color:
    rgba(
      23,
      32,
      51,
      0.58
    );

  font-size:
    0.78rem;

  font-weight: 700;
}

@keyframes weather-pulse {
  0% {
    box-shadow:
      0 0 0 0
      rgba(
        111,
        142,
        255,
        0.45
      );
  }

  70% {
    box-shadow:
      0 0 0 8px
      rgba(
        111,
        142,
        255,
        0
      );
  }

  100% {
    box-shadow:
      0 0 0 0
      rgba(
        111,
        142,
        255,
        0
      );
  }
}

@media (
  max-width: 720px
) {
  .weather-primary {
    gap: 0.55rem;
  }

  .city {
    max-width: 120px;
  }
}
</style>
