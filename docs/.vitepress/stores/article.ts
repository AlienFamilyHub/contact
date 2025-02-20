import type { Member } from '../utils/member'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { getDomain } from '../utils/link'
import { getAvatarUrl } from '../utils/member'

const defaultPreference = {
    author: 'raw' as keyof typeof authorMap,
    avatar: 'name' as keyof typeof avatarMap,
    size: 'medium' as keyof typeof sizeMap,
    wide: false,
}

export const authorMap = {
    raw: {
        label: '原始值(Feed标题)',
        transform: () => undefined,
    },
    name: {
        label: '作者名',
        transform: (m: Member) => m.name,
    },
    link: {
        label: '博客域名',
        transform: (m: Member) => getDomain(m.feed),
    },
}

export const avatarMap = {
    none: {
        label: '不展示',
        transform: () => undefined,
    },
    name: {
        label: '作者头像',
        transform: (m: Member) => getAvatarUrl(m),
    },
    link: {
        label: '网站图标',
        transform: (m: Member) => `https://unavatar.webp.se/${getDomain(m.feed)}?w`,
    },
}

export const sizeMap = {
    small: {
        label: '小',
        val: '16em',
    },
    medium: {
        label: '中',
        val: '20em',
    },
    large: {
        label: '大',
        val: '24em',
    },
}

export const useArticleStore = defineStore('article', () => {
    const preference = ref({ ...defaultPreference })
    const getAuthor = (m: Member) => authorMap[preference.value.author].transform(m)
    const getAvatar = (m: Member) => avatarMap[preference.value.avatar].transform(m)
    const size = computed(() => sizeMap[preference.value.size].val)

    return {
        preference,
        getAuthor,
        getAvatar,
        size,
    }
}, { persist: true })
