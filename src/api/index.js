// import axios from "axios";
import fetchJsonp from "fetch-jsonp";

/**
 * 音乐播放器
 */

// 获取音乐播放列表
// 配置说明：将 VITE_SONG_API 设置为你的 Meting API 或 NetEase Cloud Music API 路径，
// VITE_SONG_SERVER 为 music provider，VITE_SONG_TYPE 为 song/playlist/album/search 等，
// VITE_SONG_ID 为对应的 ID。
export const getPlayerList = async (server, type, id) => {
  const res = await fetch(
    `${import.meta.env.VITE_SONG_API}?server=${server}&type=${type}&id=${id}`,
  );
  const data = await res.json();

  if (data[0].url.startsWith("@")) {
    // eslint-disable-next-line no-unused-vars
    const [handle, jsonpCallback, jsonpCallbackFunction, url] = data[0].url.split("@").slice(1);
    const jsonpData = await fetchJsonp(url).then((res) => res.json());
    const domain = (
      jsonpData.req_0.data.sip.find((i) => !i.startsWith("http://ws")) ||
      jsonpData.req_0.data.sip[0]
    ).replace("http://", "https://");

    return data.map((v, i) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: domain + jsonpData.req_0.data.midurlinfo[i].purl,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  } else {
    return data.map((v) => ({
      name: v.name || v.title,
      artist: v.artist || v.author,
      url: v.url,
      cover: v.cover || v.pic,
      lrc: v.lrc,
    }));
  }
};

/**
 * 一言
 */

export const getHitokoto = async () => {
  const res = await fetch("https://v1.hitokoto.cn");
  return await res.json();
};

/**
 * 天气
 */

// 高德 IP 定位；仅在配置了 VITE_WEATHER_KEY 时使用
export const getAdcode = async (key) => {
  const res = await fetch(`https://restapi.amap.com/v3/ip?key=${key}`);
  return await res.json();
};

// 高德实时天气；仅在配置了 VITE_WEATHER_KEY 时使用
export const getWeather = async (key, city) => {
  const res = await fetch(
    `https://restapi.amap.com/v3/weather/weatherInfo?key=${key}&city=${city}`,
  );
  return await res.json();
};

// 无 Key 的 IP 定位：返回 city、region、country_name、latitude、longitude
export const getIpLocation = async () => {
  const res = await fetch("https://ipapi.co/json/");

  if (!res.ok) {
    throw new Error(`IP location request failed: ${res.status}`);
  }

  return await res.json();
};

// 无 Key 的实时天气：Open-Meteo
export const getOpenMeteoWeather = async (latitude, longitude) => {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current:
      "temperature_2m,weather_code,wind_speed_10m,wind_direction_10m",
    temperature_unit: "celsius",
    wind_speed_unit: "kmh",
    timezone: "auto",
    forecast_days: "1",
  });

  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?${params.toString()}`,
  );

  if (!res.ok) {
    throw new Error(`Weather request failed: ${res.status}`);
  }

  return await res.json();
};

/**
 * 博客文章
 */

const blogApiBase = (
  import.meta.env.VITE_BLOG_API ||
  "https://www.fancivoid.asia/wp-json/wp/v2"
).replace(/\/+$/, "");

const categoryIdCache = new Map();
const postsCache = new Map();

const requestBlogApi = async (path, params = {}) => {
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      search.set(key, String(value));
    }
  });

  const query = search.toString();
  const res = await fetch(`${blogApiBase}/${path}${query ? `?${query}` : ""}`);

  if (!res.ok) {
    throw new Error(`Blog API request failed: ${res.status}`);
  }

  return await res.json();
};

const getBlogCategoryId = async (categorySlug) => {
  if (categoryIdCache.has(categorySlug)) {
    return categoryIdCache.get(categorySlug);
  }

  const categories = await requestBlogApi("categories", {
    slug: categorySlug,
    _fields: "id,slug",
  });
  const categoryId = categories?.[0]?.id;

  if (!categoryId) {
    throw new Error(`Blog category not found: ${categorySlug}`);
  }

  categoryIdCache.set(categorySlug, categoryId);
  return categoryId;
};

export const getBlogPostsByCategory = async (categorySlug, limit = 4) => {
  const normalizedSlug = String(categorySlug || "").trim();
  const normalizedLimit = Math.min(Math.max(Number(limit) || 4, 1), 10);

  if (!normalizedSlug) {
    throw new Error("Blog category slug is required");
  }

  const cacheKey = `${normalizedSlug}:${normalizedLimit}`;

  if (postsCache.has(cacheKey)) {
    return postsCache.get(cacheKey);
  }

  const categoryId = await getBlogCategoryId(normalizedSlug);
  const posts = await requestBlogApi("posts", {
    categories: categoryId,
    per_page: normalizedLimit,
    order: "desc",
    orderby: "date",
    _fields: "id,date,link,slug,title,excerpt",
  });

  if (!Array.isArray(posts)) {
    throw new Error("Invalid blog posts response");
  }

  postsCache.set(cacheKey, posts);
  return posts;
};
