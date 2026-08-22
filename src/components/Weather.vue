<template>
  <div class="weather-widget" aria-live="polite">
    <div v-if="status === 'loading'" class="weather-state">
      <span class="loading-dot" aria-hidden="true"></span>
      <span>正在获取天气</span>
    </div>

    <div v-else-if="status === 'error'" class="weather-state weather-error">
      <span>暂时无法获取天气</span>
      <button type="button" class="retry-button" @click="getWeatherData">
        重新获取
      </button>
    </div>

    <div v-else class="weather-content">
      <div class="weather-primary">
        <span class="weather-icon" aria-hidden="true">
          {{ weatherIcon }}
        </span>

        <span class="temperature">
          {{ weatherData.temperature }}<small>℃</small>
        </span>

        <div class="weather-summary">
          <span class="city">{{ weatherData.city }}</span>
          <span class="condition">{{ weatherData.condition }}</span>
        </div>
      </div>

      <div class="weather-meta">
        <span>{{ formattedWindDirection }}</span>
        <span>{{ weatherData.windDetail || "风速未知" }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import {
  getAdcode,
  getIpLocation,
  getOpenMeteoWeather,
  getWeather,
} from "@/api";

const mainKey = (import.meta.env.VITE_WEATHER_KEY || "").trim();
const status = ref("loading");

const weatherData = reactive({
  city: "",
  condition: "",
  temperature: "",
  weatherCode: null,
  windDirection: "",
  windDetail: "",
});

const normalizeText = (value, fallback = "") => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(" ") || fallback;
  }

  const text = String(value ?? "").trim();
  return text || fallback;
};

const requestWithTimeout = (request, timeout = 10000) =>
  new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      reject(new Error("Weather request timed out"));
    }, timeout);

    request
      .then((result) => {
        window.clearTimeout(timer);
        resolve(result);
      })
      .catch((error) => {
        window.clearTimeout(timer);
        reject(error);
      });
  });

const weatherCodeText = (code) => {
  const descriptions = {
    0: "晴",
    1: "晴间多云",
    2: "多云",
    3: "阴",
    45: "雾",
    48: "雾凇",
    51: "小毛毛雨",
    53: "毛毛雨",
    55: "强毛毛雨",
    56: "轻微冻毛毛雨",
    57: "冻毛毛雨",
    61: "小雨",
    63: "中雨",
    65: "大雨",
    66: "轻微冻雨",
    67: "冻雨",
    71: "小雪",
    73: "中雪",
    75: "大雪",
    77: "米雪",
    80: "小阵雨",
    81: "阵雨",
    82: "强阵雨",
    85: "小阵雪",
    86: "强阵雪",
    95: "雷暴",
    96: "雷暴伴小冰雹",
    99: "雷暴伴强冰雹",
  };

  return descriptions[code] || "天气未知";
};

const degreesToDirection = (degrees) => {
  const value = Number(degrees);

  if (!Number.isFinite(value)) {
    return "";
  }

  const directions = ["北", "东北", "东", "东南", "南", "西南", "西", "西北"];
  return `${directions[Math.round(value / 45) % directions.length]}风`;
};

const applyAmapWeather = async () => {
  const location = await requestWithTimeout(getAdcode(mainKey));

  if (location?.infocode !== "10000" || !location?.adcode) {
    throw new Error("Unable to resolve visitor location with AMap");
  }

  const result = await requestWithTimeout(
    getWeather(mainKey, location.adcode),
  );
  const live = result?.lives?.[0];

  if (!live?.weather || live?.temperature === undefined) {
    throw new Error("Invalid AMap weather response");
  }

  weatherData.city = normalizeText(live.city || location.city, "未知地区");
  weatherData.condition = normalizeText(live.weather, "天气未知");
  weatherData.temperature = normalizeText(live.temperature, "--");
  weatherData.weatherCode = null;
  weatherData.windDirection = normalizeText(live.winddirection);
  weatherData.windDetail = live.windpower
    ? `风力 ${normalizeText(live.windpower)} 级`
    : "风力未知";
};

const applyOpenMeteoWeather = async () => {
  const location = await requestWithTimeout(getIpLocation());
  const latitude = Number(location?.latitude);
  const longitude = Number(location?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("Unable to resolve visitor coordinates");
  }

  const result = await requestWithTimeout(
    getOpenMeteoWeather(latitude, longitude),
  );
  const current = result?.current;
  const temperature = Number(current?.temperature_2m);
  const weatherCode = Number(current?.weather_code);
  const windSpeed = Number(current?.wind_speed_10m);

  if (!Number.isFinite(temperature) || !Number.isFinite(weatherCode)) {
    throw new Error("Invalid Open-Meteo weather response");
  }

  weatherData.city = normalizeText(
    location.city || location.region || location.country_name,
    "未知地区",
  );
  weatherData.condition = weatherCodeText(weatherCode);
  weatherData.temperature = Math.round(temperature);
  weatherData.weatherCode = weatherCode;
  weatherData.windDirection = degreesToDirection(current.wind_direction_10m);
  weatherData.windDetail = Number.isFinite(windSpeed)
    ? `${Math.round(windSpeed)} km/h`
    : "风速未知";
};

const getWeatherData = async () => {
  if (status.value === "loading") {
    return;
  }

  status.value = "loading";

  try {
    if (mainKey) {
      await applyAmapWeather();
    } else {
      await applyOpenMeteoWeather();
    }

    status.value = "success";
  } catch (error) {
    console.error("天气信息获取失败：", error);
    status.value = "error";
  }
};

const formattedWindDirection = computed(() => {
  const direction = weatherData.windDirection;

  if (!direction) {
    return "风向未知";
  }

  return direction.endsWith("风") ? direction : `${direction}风`;
});

const weatherIcon = computed(() => {
  const code = weatherData.weatherCode;

  if ([95, 96, 99].includes(code) || /雷/.test(weatherData.condition)) return "ϟ";
  if ([71, 73, 75, 77, 85, 86].includes(code) || /雪/.test(weatherData.condition)) return "❄";
  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code) || /雨/.test(weatherData.condition)) return "☂";
  if ([45, 48].includes(code) || /雾|霾/.test(weatherData.condition)) return "≋";
  if ([2, 3].includes(code) || /云|阴/.test(weatherData.condition)) return "☁";
  if ([0, 1].includes(code) || /晴/.test(weatherData.condition)) return "☀";

  return "◌";
});

onMounted(() => {
  status.value = "idle";
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
  color: rgba(23, 32, 51, 0.62);
  font-size: 0.9rem;
  font-weight: 700;
}

.loading-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #6f8eff;
  box-shadow: 0 0 0 rgba(111, 142, 255, 0.5);
  animation: weather-pulse 1.4s infinite;
}

.weather-error {
  flex-direction: column;
  gap: 0.5rem;
}

.retry-button {
  padding: 0.32rem 0.72rem;
  border: 1px solid rgba(79, 124, 255, 0.24);
  border-radius: 999px;
  background: rgba(224, 235, 255, 0.68);
  color: rgba(35, 52, 86, 0.86);
  font: inherit;
  font-size: 0.78rem;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(224, 235, 255, 0.92);
  }
}

.weather-content {
  width: 100%;
}

.weather-primary {
  display: flex;
  align-items: center;
  justify-content: center;
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
    margin-left: 0.1rem;
    font-size: 0.8rem;
    color: rgba(23, 32, 51, 0.58);
  }
}

.weather-summary {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.18rem;
}

.city {
  max-width: 180px;
  overflow: hidden;
  color: rgba(23, 32, 51, 0.82);
  font-size: 0.9rem;
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.condition {
  color: rgba(23, 32, 51, 0.62);
  font-size: 0.82rem;
  font-weight: 700;
}

.weather-meta {
  margin-top: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: rgba(23, 32, 51, 0.58);
  font-size: 0.78rem;
  font-weight: 700;
}

@keyframes weather-pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(111, 142, 255, 0.45);
  }

  70% {
    box-shadow: 0 0 0 8px rgba(111, 142, 255, 0);
  }

  100% {
    box-shadow: 0 0 0 0 rgba(111, 142, 255, 0);
  }
}

@media (max-width: 720px) {
  .weather-primary {
    gap: 0.55rem;
  }

  .city {
    max-width: 120px;
  }
}
</style>
