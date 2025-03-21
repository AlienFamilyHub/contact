import antfu from '@antfu/eslint-config'

export default antfu({
    stylistic: {
        indent: 4,
    },
    rules: {
        'jsonc/indent': ['error', 2],
        'yaml/indent': ['error', 2],
    },
}, {
    files: ['**/*.json'],
    rules: {
        'jsonc/sort-keys': 'off',
        'style/eol-last': 'off',
    },
})
