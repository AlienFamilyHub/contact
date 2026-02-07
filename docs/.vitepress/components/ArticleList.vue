<script setup lang="ts">
import type { Article } from '../utils/atricle'
import { useIntersectionObserver } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { ref, useTemplateRef } from 'vue'
import { useArticleStore } from '../stores/article'
import { queryBuild } from '../utils/link'
import ArticleItem from './ArticleItem.vue'
import ArticlePreference from './ArticlePreference.vue'

const { preference, size } = storeToRefs(useArticleStore())
const { api } = useArticleStore()

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

	const url = queryBuild(api('/feed/'), {
		size: pageStatus.value.size,
		page: pageStatus.value.current_page + 1,
	})

	const resp = await fetch(url)
	// data: { code, status, data: [], message }
	const { data, message } = await resp.json()

	loading.value = false
	pageStatus.value = message?.pagination
	articleList.value.push(...data)
}

const loadTrigger = useTemplateRef<Element[]>('load-trigger')
// @ts-expect-error https://github.com/vueuse/vueuse/issues/4712
// `useIntersectionObserver` | `useTemplateRef` of array type cannot be passed as argument
useIntersectionObserver(loadTrigger, ([{ isIntersecting }]) => {
	if (isIntersecting)
		loadMore()
})
</script>

<template>
<h1>文章列表</h1>
<p class="stats vp-doc">
	<span>共 {{ pageStatus.total }} 篇文章</span>

	<a :href="api('/feed/opml')" target="_blank">OPML</a>

	<Dropdown title="偏好设置">
		<Icon icon="ri:list-settings-fill" class="cursor-pointer" width="20" />
		<template #content>
			<ArticlePreference />
		</template>
	</Dropdown>
</p>

<section class="article-list" :class="{ narrow: !preference.wide }" :style="{ '--size': size }">
	<ArticleItem v-for="item in articleList" :key="item._id" v-bind="item" />
	<div
		v-for="i in pageStatus.size"
		v-show="pageStatus.has_next_page"
		ref="load-trigger"
		:key="i"
		class="loading-item"
	/>
</section>
</template>

<style scoped>
h1 {
	margin: 2em 0 2rem;
	font: revert;
	line-height: 1.4;
	text-align: center;
}

.stats {
	display: flex;
	justify-content: center;
	gap: 1em;
}

.article-list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(var(--size, 20rem), 1fr));
	gap: 1rem;
	margin: 2rem auto;
}

.article-list.narrow {
	max-width: 83rem;
}

.loading-item {
	min-height: 10rem;
	border-radius: 0.5rem;
	background-color: var(--vp-c-bg-soft);
	animation: fade-in 1s both;
	animation-timeline: view();
}

@keyframes fade-in {
	0% { opacity: 0; }
	50% { opacity: 1; }
}
</style>
