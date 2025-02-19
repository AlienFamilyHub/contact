import type { Member } from '../utils/member'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getDomain } from '../utils/link'
import { getAvatarUrl } from '../utils/member'

const defaultPreferce = {
    author: 'raw' as keyof typeof authorMap,
    avatar: 'avatar' as keyof typeof avatarMap,
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

export const useArticleStore = defineStore('article', () => {
    const preference = ref({ ...defaultPreferce })
    const getAuthor = (m: Member) => authorMap[preference.value.author].transform(m)
    const getAvatar = (m: Member) => avatarMap[preference.value.avatar].transform(m)

    return {
        preference,
        getAuthor,
        getAvatar,
    }
}, { persist: true })
