import {
  getBlogPostsByCategory,
  getWeather,
} from "@/api";


/* =========================================================
   Configuration
   ========================================================= */

const CACHE_PREFIX =
  "fancivoid-api-v2:";

const WEATHER_CACHE_KEY =
  "weather";

const WEATHER_TTL =
  10 * 60 * 1000;

const BLOG_TTL =
  10 * 60 * 1000;

const memoryCache =
  new Map();

const pendingRequests =
  new Map();


/* =========================================================
   Generic cache
   ========================================================= */

const getStorageKey = (
  key,
) => {
  return `${CACHE_PREFIX}${key}`;
};


const readRawCache = (
  key,
) => {
  const storageKey =
    getStorageKey(key);

  if (
    memoryCache.has(
      storageKey,
    )
  ) {
    return memoryCache.get(
      storageKey,
    );
  }

  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  try {
    const raw =
      window.sessionStorage
        .getItem(
          storageKey,
        );

    if (!raw) {
      return null;
    }

    const parsed =
      JSON.parse(raw);

    memoryCache.set(
      storageKey,
      parsed,
    );

    return parsed;
  } catch (error) {
    console.warn(
      "读取 API 缓存失败：",
      error,
    );

    return null;
  }
};


const readCache = (
  key,
  ttl,
  allowStale = false,
) => {
  const record =
    readRawCache(key);

  if (
    !record ||
    !record.timestamp ||
    record.data ===
      undefined
  ) {
    return null;
  }

  const age =
    Date.now() -
    record.timestamp;

  const fresh =
    age < ttl;

  if (
    !fresh &&
    !allowStale
  ) {
    return null;
  }

  return {
    data: record.data,
    fresh,
    age,
  };
};


const writeCache = (
  key,
  data,
) => {
  const storageKey =
    getStorageKey(key);

  const record = {
    timestamp:
      Date.now(),

    data,
  };

  memoryCache.set(
    storageKey,
    record,
  );

  if (
    typeof window ===
    "undefined"
  ) {
    return;
  }

  try {
    window.sessionStorage
      .setItem(
        storageKey,
        JSON.stringify(
          record,
        ),
      );
  } catch (error) {
    console.warn(
      "写入 API 缓存失败：",
      error,
    );
  }
};


/*
  后台预加载和用户点击页面时
  共用同一个 Promise。

  防止重复请求。
*/

const runSharedRequest =
  (
    key,
    task,
  ) => {
    if (
      pendingRequests.has(
        key,
      )
    ) {
      return pendingRequests.get(
        key,
      );
    }

    const request =
      Promise.resolve()
        .then(task)
        .finally(() => {
          pendingRequests.delete(
            key,
          );
        });

    pendingRequests.set(
      key,
      request,
    );

    return request;
  };


/* =========================================================
   Blog
   ========================================================= */

const getBlogCacheKey =
  (
    category,
    limit,
  ) => {
    return `blog:${category}:${limit}`;
  };


export const peekBlogPosts =
  (
    category,
    limit = 4,
  ) => {
    return readCache(
      getBlogCacheKey(
        category,
        limit,
      ),

      BLOG_TTL,

      true,
    );
  };


export const getCachedBlogPosts =
  async (
    category,
    limit = 4,
    {
      force = false,
    } = {},
  ) => {
    const cacheKey =
      getBlogCacheKey(
        category,
        limit,
      );

    const cached =
      readCache(
        cacheKey,
        BLOG_TTL,
        true,
      );

    if (
      !force &&
      cached?.fresh
    ) {
      return cached.data;
    }

    try {
      return await runSharedRequest(
        `request:${cacheKey}`,

        async () => {
          const result =
            await getBlogPostsByCategory(
              category,
              limit,
            );

          writeCache(
            cacheKey,
            result,
          );

          return result;
        },
      );
    } catch (error) {
      /*
        WordPress 临时失败时，
        有旧缓存就继续显示。
      */

      if (cached?.data) {
        console.warn(
          `博客 ${category} 请求失败，使用旧缓存`,
          error,
        );

        return cached.data;
      }

      throw error;
    }
  };


/* =========================================================
   Weather
   ========================================================= */

/*
  WeatherAPI 返回例如：

  {
    ok: true,
    city: "Doncaster",
    condition: "附近局部降雨",
    temperature: 10,
    windDirection: "WSW",
    windDegree: 245,
    ...
  }

  这里再转换成 Weather.vue
  已经使用的统一结构。
*/

const degreesToChineseDirection =
  (
    degree,
  ) => {
    const value =
      Number(degree);

    if (
      !Number.isFinite(
        value,
      )
    ) {
      return "";
    }

    const directions = [
      "北",
      "东北",
      "东",
      "东南",
      "南",
      "西南",
      "西",
      "西北",
    ];

    return directions[
      Math.round(
        value / 45,
      ) %
        directions.length
    ];
  };


const normalizeWeather =
  (
    result,
  ) => {
    const windSpeed =
      Number(
        result?.windSpeed,
      );

    const chineseDirection =
      degreesToChineseDirection(
        result?.windDegree,
      );

    return {
      city:
        result?.city ||
        "未知地区",

      region:
        result?.region ||
        "",

      country:
        result?.country ||
        "",

      condition:
        result?.condition ||
        "天气未知",

      temperature:
        result
          ?.temperature ??
        "--",

      /*
        这里仍保存 WeatherAPI code。
        Weather.vue 主要依靠中文 condition
        判断图标，因此没有问题。
      */
      weatherCode:
        result
          ?.weatherCode ??
        null,

      windDirection:
        chineseDirection,

      windDetail:
        Number.isFinite(
          windSpeed,
        )
          ? `${Math.round(
              windSpeed,
            )} km/h`
          : "风速未知",

      humidity:
        result?.humidity ??
        null,

      feelsLike:
        result?.feelsLike ??
        null,

      timezone:
        result?.timezone ||
        "",

      localTime:
        result?.localTime ||
        "",

      isDay:
        result?.isDay ??
        null,

      lastUpdated:
        result?.lastUpdated ||
        "",

      source:
        "weatherapi",
    };
  };


export const peekWeatherCache =
  () => {
    return readCache(
      WEATHER_CACHE_KEY,
      WEATHER_TTL,
      true,
    );
  };


export const getCachedWeather =
  async ({
    force = false,
  } = {}) => {
    const cached =
      peekWeatherCache();

    /*
      10 分钟内直接使用缓存。
    */

    if (
      !force &&
      cached?.fresh
    ) {
      return cached.data;
    }

    try {
      return await runSharedRequest(
        "request:weather",

        async () => {
          const raw =
            await getWeather();

          const result =
            normalizeWeather(
              raw,
            );

          writeCache(
            WEATHER_CACHE_KEY,
            result,
          );

          return result;
        },
      );
    } catch (error) {
      /*
        WeatherAPI 临时不可用：

        如果之前成功获取过，
        继续显示旧缓存。
      */

      if (cached?.data) {
        console.warn(
          "天气刷新失败，使用旧缓存",
          error,
        );

        return cached.data;
      }

      throw error;
    }
  };


/* =========================================================
   Low-priority prefetch
   ========================================================= */

export const prefetchHomeApis =
  async () => {
    return Promise.allSettled([
      getCachedWeather(),

      getCachedBlogPosts(
        "technology",
        4,
      ),

      getCachedBlogPosts(
        "comment",
        4,
      ),
    ]);
  };