// import axios from "axios";
import fetchJsonp from "fetch-jsonp";


/**
 * 音乐播放器
 */

// 获取音乐播放列表
export const getPlayerList = async (
  server,
  type,
  id,
) => {
  const res = await fetch(
    `${import.meta.env.VITE_SONG_API}?server=${server}&type=${type}&id=${id}`,
  );

  const data = await res.json();

  if (
    data[0].url.startsWith("@")
  ) {
    const [
      handle,
      jsonpCallback,
      jsonpCallbackFunction,
      url,
    ] = data[0].url
      .split("@")
      .slice(1);

    const jsonpData =
      await fetchJsonp(
        url,
      ).then(
        (res) =>
          res.json(),
      );

    const domain = (
      jsonpData.req_0.data.sip.find(
        (i) =>
          !i.startsWith(
            "http://ws",
          ),
      ) ||
      jsonpData.req_0.data
        .sip[0]
    ).replace(
      "http://",
      "https://",
    );

    return data.map(
      (v, i) => ({
        name:
          v.name ||
          v.title,

        artist:
          v.artist ||
          v.author,

        url:
          domain +
          jsonpData.req_0
            .data.midurlinfo[
            i
          ].purl,

        cover:
          v.cover ||
          v.pic,

        lrc: v.lrc,
      }),
    );
  }

  return data.map(
    (v) => ({
      name:
        v.name ||
        v.title,

      artist:
        v.artist ||
        v.author,

      url: v.url,

      cover:
        v.cover ||
        v.pic,

      lrc: v.lrc,
    }),
  );
};


/**
 * 一言
 */

export const getHitokoto =
  async () => {
    const res =
      await fetch(
        "https://v1.hitokoto.cn",
      );

    return await res.json();
  };


/**
 * 天气
 *
 * 不再从浏览器直接访问：
 *
 * - 高德
 * - ipapi.co
 * - Open-Meteo
 *
 * 浏览器只访问本站同源 PHP：
 *
 * /api/weather.php
 *
 * PHP 再向 WeatherAPI.com 请求天气。
 */

export const getWeather =
  async () => {
    const res =
      await fetch(
        "/api/weather.php",
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",
          },

          cache: "no-store",
        },
      );

    if (!res.ok) {
      throw new Error(
        `Weather API request failed: ${res.status}`,
      );
    }

    const data =
      await res.json();

    if (!data?.ok) {
      throw new Error(
        data?.message ||
          "Weather service unavailable",
      );
    }

    return data;
  };


/**
 * 博客文章
 */

const blogApiBase = (
  import.meta.env
    .VITE_BLOG_API ||
  "https://www.fancivoid.asia/wp-json/wp/v2"
).replace(
  /\/+$/,
  "",
);

const categoryIdCache =
  new Map();

const postsCache =
  new Map();


const requestBlogApi =
  async (
    path,
    params = {},
  ) => {
    const search =
      new URLSearchParams();

    Object.entries(
      params,
    ).forEach(
      ([key, value]) => {
        if (
          value !==
            undefined &&
          value !== null &&
          value !== ""
        ) {
          search.set(
            key,
            String(value),
          );
        }
      },
    );

    const query =
      search.toString();

    const res =
      await fetch(
        `${blogApiBase}/${path}${
          query
            ? `?${query}`
            : ""
        }`,
      );

    if (!res.ok) {
      throw new Error(
        `Blog API request failed: ${res.status}`,
      );
    }

    return await res.json();
  };


const getBlogCategoryId =
  async (
    categorySlug,
  ) => {
    if (
      categoryIdCache.has(
        categorySlug,
      )
    ) {
      return categoryIdCache.get(
        categorySlug,
      );
    }

    const categories =
      await requestBlogApi(
        "categories",
        {
          slug:
            categorySlug,

          _fields:
            "id,slug",
        },
      );

    const categoryId =
      categories?.[0]?.id;

    if (!categoryId) {
      throw new Error(
        `Blog category not found: ${categorySlug}`,
      );
    }

    categoryIdCache.set(
      categorySlug,
      categoryId,
    );

    return categoryId;
  };


export const getBlogPostsByCategory =
  async (
    categorySlug,
    limit = 4,
  ) => {
    const normalizedSlug =
      String(
        categorySlug ||
          "",
      ).trim();

    const normalizedLimit =
      Math.min(
        Math.max(
          Number(limit) ||
            4,
          1,
        ),
        10,
      );

    if (!normalizedSlug) {
      throw new Error(
        "Blog category slug is required",
      );
    }

    const cacheKey =
      `${normalizedSlug}:${normalizedLimit}`;

    if (
      postsCache.has(
        cacheKey,
      )
    ) {
      return postsCache.get(
        cacheKey,
      );
    }

    const categoryId =
      await getBlogCategoryId(
        normalizedSlug,
      );

    const posts =
      await requestBlogApi(
        "posts",
        {
          categories:
            categoryId,

          per_page:
            normalizedLimit,

          order: "desc",

          orderby:
            "date",

          _fields:
            "id,date,link,slug,title,excerpt",
        },
      );

    if (
      !Array.isArray(
        posts,
      )
    ) {
      throw new Error(
        "Invalid blog posts response",
      );
    }

    postsCache.set(
      cacheKey,
      posts,
    );

    return posts;
  };