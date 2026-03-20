// https://vitepress.dev/zh/guide/custom-theme
import type { Theme } from 'vitepress'
import type { directive, Tippy } from 'vue-tippy'
import { Icon } from '@iconify/vue'
import { createPinia } from 'pinia'
import DefaultTheme from 'vitepress/theme-without-fonts'
import { h } from 'vue'
import VueTippy, { roundArrow } from 'vue-tippy'

import Dropdown from '../components/atomic/Dropdown.vue'
import Footer from '../components/Footer.vue'
import NotFound from '../components/NotFound.vue'

import 'tippy.js/dist/svg-arrow.css'
import './reusable.css'
import './style.css'
import './theme-enhanced.css'

// @keep-sorted
const globalComponents = {
	Dropdown,
	Icon,
}

export type GlobalComponentTypes = typeof globalComponents

declare module 'vue' {
	interface GlobalComponents extends GlobalComponentTypes {
		Tooltip: typeof Tippy
	}

	interface GlobalDirectives {
		vTip: typeof directive
	}

	interface ComponentCustomProperties {
		$frontmatter: Record<string, any>
		$param: Record<string, any>
	}
}

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
		Object.entries(globalComponents).forEach(args => app.component(...args))

		const pinia = createPinia()

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
