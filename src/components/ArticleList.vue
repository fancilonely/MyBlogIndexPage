<template>
  <div class="article-panel" aria-live="polite">
    <div v-if="status === 'loading'" class="article-state">
      <span class="loading-dot" aria-hidden="true"></span>
      <span>正在读取文章</span>
    </div>

    <div v-else-if="status === 'error'" class="article-state error-state">
      <span>暂时无法读取文章</span>
      <button type="button" class="retry-button" @click="loadPosts">
        重新获取
      </button>
    </div>

    <div v-else-if="posts.length === 0" class="article-state">
      暂无文章
    </div>

    <div v-else class="article-list">
      <a
        v-for="post in posts"
        :key="post.id"
        class="article-card"
        :href="post.link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div class="article-heading">
          <h3>{{ post.title }}</h3>
          <span class="article-arrow" aria-hidden="true">↗</span>
        </div>

        <p>{{ post.excerpt }}</p>

        <time :datetime="post.date">
          {{ formatDate(post.date) }}
        </time>
      </a>
    </div>

    <a
      class="all-posts-link"
      :href="allUrl"
      target="_blank"
      rel="noopener noreferrer"
    >
      查看全部
      <span aria-hidden="true">→</span>
    </a>
  </div>
</template>

<script setup>
import { onBeforeUnmount, ref, watch } from "vue";
import { getBlogPostsByCategory } from "@/api";

const props = defineProps({
  category: {
    type: String,
    required: true,
  },
  allUrl: {
    type: String,
    required: true,
  },
  limit: {
    type: Number,
    default: 4,
  },
});

const status = ref("loading");
const posts = ref([]);
let requestToken = 0;

const decodeHtml = (value) => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = String(value || "");
  return textarea.value;
};

const toPlainText = (value) => {
  const withoutTags = String(value || "").replace(/<[^>]*>/g, " ");
  return decodeHtml(withoutTags).replace(/\s+/g, " ").trim();
};

const normalizePost = (post) => ({
  id: post.id,
  date: post.date,
  link: post.link,
  title: toPlainText(post.title?.rendered) || "未命名文章",
  excerpt: toPlainText(post.excerpt?.rendered) || "点击阅读完整内容。",
});

const formatDate = (date) => {
  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return "日期未知";
  }

  const year = value.getFullYear();
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

const loadPosts = async () => {
  const currentToken = ++requestToken;
  status.value = "loading";

  try {
    const result = await getBlogPostsByCategory(props.category, props.limit);

    if (currentToken !== requestToken) {
      return;
    }

    posts.value = result.map(normalizePost);
    status.value = "success";
  } catch (error) {
    if (currentToken !== requestToken) {
      return;
    }

    console.error(`博客分类 ${props.category} 获取失败：`, error);
    posts.value = [];
    status.value = "error";
  }
};

watch(
  () => [props.category, props.limit],
  () => loadPosts(),
  { immediate: true },
);

onBeforeUnmount(() => {
  requestToken += 1;
});
</script>

<style lang="scss" scoped>
.article-panel {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.article-list {
  flex: 1 1 auto;
  min-height: 0;
  padding-right: 4px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(77, 101, 150, 0.3) transparent;
}

.article-card {
  flex: 0 0 auto;
  min-width: 0;
  padding: 13px 14px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.58);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.56);
  color: #172033;
  text-decoration: none;
  transition:
    transform 0.22s ease,
    background 0.22s ease,
    border-color 0.22s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(111, 142, 255, 0.28);
    background: rgba(255, 255, 255, 0.72);
  }

  p {
    margin: 7px 0 10px;
    display: -webkit-box;
    overflow: hidden;
    color: rgba(23, 32, 51, 0.61);
    font-size: 0.78rem;
    line-height: 1.55;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  time {
    color: rgba(23, 32, 51, 0.48);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.04em;
  }
}

.article-heading {
  display: flex;
  align-items: center;
  gap: 10px;

  h3 {
    flex: 1;
    min-width: 0;
    margin: 0;
    overflow: hidden;
    color: rgba(23, 32, 51, 0.88);
    font-size: 0.88rem;
    font-weight: 800;
    line-height: 1.4;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.article-arrow {
  flex: 0 0 auto;
  color: rgba(73, 103, 174, 0.62);
  font-size: 0.88rem;
}

.article-state {
  flex: 1 1 auto;
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.65rem;
  color: rgba(23, 32, 51, 0.58);
  font-size: 0.86rem;
  font-weight: 700;
}

.loading-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #6f8eff;
  animation: article-pulse 1.4s infinite;
}

.error-state {
  flex-direction: column;
  gap: 0.55rem;
}

.retry-button {
  padding: 0.3rem 0.7rem;
  border: 1px solid rgba(79, 124, 255, 0.24);
  border-radius: 999px;
  background: rgba(224, 235, 255, 0.68);
  color: rgba(35, 52, 86, 0.86);
  font: inherit;
  font-size: 0.76rem;
  cursor: pointer;
}

.all-posts-link {
  flex: 0 0 auto;
  align-self: flex-end;
  margin-top: 13px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: rgba(50, 75, 132, 0.72);
  font-size: 0.78rem;
  font-weight: 800;
  text-decoration: none;

  &:hover {
    color: rgba(50, 75, 132, 0.96);
  }
}

@keyframes article-pulse {
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
  .article-list {
    gap: 10px;
  }

  .article-card {
    padding: 12px;
  }
}
</style>
