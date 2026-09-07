import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['dist/**', 'coverage/**', 'node_modules/**', 'public/**', 'src/**/__snapshots__/**'],
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['src/**/*.{ts,tsx}'],
		plugins: {
			'react-hooks': reactHooks,
			'react-refresh': reactRefresh,
		},
		rules: {
			...reactHooks.configs.recommended.rules,
			// The game classes are plain data holders passed straight into React
			// state, and their props interfaces predate this config; `any` there is
			// pre-existing and not what this lint run is for.
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
			'prefer-const': 'error',
			eqeqeq: ['error', 'always'],
		},
	},
	{
		files: ['src/**/*.test.{ts,tsx}'],
		rules: {
			'react-refresh/only-export-components': 'off',
		},
	},
);
