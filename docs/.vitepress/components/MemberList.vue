<script setup lang="ts">
import { onMounted, ref } from 'vue'
import membersData from '../data/members'
import MemberCard from './MemberCard.vue'

const members = ref([...membersData])

const shuffleMembers = () => members.value.sort(() => Math.random() - 0.5)

onMounted(shuffleMembers)
</script>

<template>
    <div>
        <h2>
            成员
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
