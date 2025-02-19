<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { authorMap, avatarMap, useArticleStore } from '../stores/article'

const { preference } = storeToRefs(useArticleStore())
</script>

<template>
    <form>
        <label for="preference">来源展示</label>
        <select id="preference" v-model="preference.author">
            <option v-for="(author, key) in authorMap" :key :value="key">
                {{ author.label }}
            </option>
        </select>
        <label for="preference">头像展示</label>
        <select id="preference" v-model="preference.avatar">
            <option v-for="(avatar, key) in avatarMap" :key :value="key">
                {{ avatar.label }}
            </option>
        </select>
    </form>
</template>

<style scoped>
form {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 1rem;
    text-align: left;
}
</style>
