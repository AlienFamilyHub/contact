<script setup lang="ts">
import { onMounted, ref } from 'vue'
import membersData from '../data/members.json'
import MemberCard from './MemberCard.vue'

const members = ref([...membersData])

const shuffleMembers = () => members.value.sort(() => Math.random() - 0.5)

onMounted(shuffleMembers)

function modifyMembers() {
	const confirmMsg = '跳转到在线文档修改成员列表？修改完成后，可从页脚网站仓库提交 PR。'
	// eslint-disable-next-line no-alert
	if (!window?.confirm(confirmMsg))
		return
	window.open('https://docs.qq.com/sheet/DSnhYT3pIaEt2WUds')
}
</script>

<template>
<div>
	<h2>
		成员
		<Badge text="修改" style="cursor: pointer;" @click="modifyMembers" />
		<Icon class="shuffle-btn" icon="ri:shuffle-fill" @click="shuffleMembers" />
	</h2>
	<TransitionGroup tag="section" class="card-list" name="list">
		<MemberCard v-for="member in members" :key="member.github" v-bind="member" />
	</TransitionGroup>
</div>
</template>

<style scoped>
.list-move {
	transition: all 0.2s;
}

.shuffle-btn {
	float: right;
	cursor: pointer;
}

.card-list {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(15em, 1fr));
	gap: 0.8rem;
}
</style>
