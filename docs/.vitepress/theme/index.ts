// https://vitepress.dev/zh/guide/custom-theme
import type { Theme } from 'vitepress'
import { Icon } from '@iconify/vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { h } from 'vue'
import VueTippy, { roundArrow } from 'vue-tippy'

import Dropdown from '../components/Dropdown.vue'
import Footer from '../components/Footer.vue'
import NotFound from '../components/NotFound.vue'

import './reusable.css'
import './style.css'
import './theme-enhanced.css'
import 'tippy.js/dist/svg-arrow.css'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

export default {
    extends: DefaultTheme,
    Layout: () => {
        return h(DefaultTheme.Layout, null, {
            // https://vitepress.dev/zh/guide/extending-default-theme#layout-slots
            'doc-after': () => h(Footer),
            'not-found': () => h(NotFound),
        })
    },
    enhanceApp({ app }) {
        app.component('Icon', Icon)
        app.component('Dropdown', Dropdown)

        app.use(pinia)
        app.use(VueTippy, {
            component: 'Tooltip',
            directive: 'tip',
            defaultProps: {
                arrow: roundArrow,
            },
        })
    },
} satisfies Theme
