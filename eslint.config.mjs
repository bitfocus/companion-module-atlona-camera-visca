import { generateEslintConfig } from '@companion-module/tools/eslint/config.mjs'

const baseConfig = await generateEslintConfig({})

const customConfig = [
	...baseConfig,

	{
		languageOptions: {
			sourceType: 'module',
		},
	},
	{
		ignores: ['test/', '*.cjs', 'check_*.js', 'test_*.js', 'edit_*.js'],
	},
]

export default customConfig
