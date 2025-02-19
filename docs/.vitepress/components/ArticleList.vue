<script setup lang="ts">
import type { Article } from '../utils/atricle'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'
import ArticleItem from './ArticleItem.vue'
import ArticlePreference from './ArticlePreference.vue'

const loading = ref(false)
// 根据 API 返回的数据格式定义
const pageStatus = ref({
    total: 0,
    current_page: 0,
    total_page: 0,
    size: 12,
    has_prev_page: false,
    has_next_page: true,
})
const articleList = ref<Article[]>([])

async function loadMore() {
    if (loading.value)
        return
    loading.value = true

    const { size, current_page: page } = pageStatus.value
    const resp = await fetch(`https://tapi-afh.rikki.top/feed/?size=${size}&page=${page + 1}`)
    // data: { code, status, data: [], message }
    const { data, message } = await resp.json()

    loading.value = false
    pageStatus.value = message?.pagination
    articleList.value.push(...data)
}

const loadTrigger = useTemplateRef<Element[]>('load-trigger')
let observer: IntersectionObserver

onMounted(() => {
    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => entry.isIntersecting && loadMore())
    })
    loadTrigger.value?.forEach(item => observer.observe(item))
})

onUnmounted(() => {
    observer?.disconnect()
})
</script>

<template>
    <h1>文章列表</h1>
    <p class="stats">
        共 {{ pageStatus.total }} 篇文章
        <Dropdown trigger="click">
            <Icon icon="ri:list-settings-fill" />
            <template #content>
                <ArticlePreference />
            </template>
        </Dropdown>
    </p>

    <TransitionGroup tag="section" class="article-list">
        <ArticleItem v-for="item in articleList" :key="item._id" v-bind="item" />
        <template v-if="pageStatus.has_next_page">
            <div v-for="i in pageStatus.size" ref="load-trigger" :key="i" class="loading-item" />
        </template>
    </TransitionGroup>
</template>

<style scoped>
h1, .stats {
    margin: 2rem 0;
    text-align: center;
}

.article-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
    gap: 1rem;
}

.loading-item {
    height: 10rem;
    border-radius: 0.5rem;
    background-color: var(--vp-c-bg-soft);
    animation: fade-in 1s both;
    animation-timeline: view();
}

@keyframes fade-in {
    0% { opacity: 0; }
    50% { opacity: 1; }
}

.loading-item.v-enter-from {
    opacity: 0;
}

.loading-item.v-leave-active {
    display: none;
}
</style>
