import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import pluginSimpleImportSort from 'eslint-plugin-simple-import-sort';
import globals from 'globals';
import ts from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['**/build/**', '**/dist/**', '**/routeTree.gen.ts']),

  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: { globals: globals.browser },
    settings: { react: { version: 'detect' } },
  },

  js.configs.recommended,
  ts.configs.recommended,
  ts.configs.stylistic,

  pluginReact.configs.flat.recommended,
  pluginReactHooks.configs.flat.recommended,

  {
    plugins: { 'simple-import-sort': pluginSimpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
    },
  },

  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      // Modern React (17+) JSX transform does not require React in scope
      'react/react-in-jsx-scope': 'off',
    },
  },

  // web/ files are migrated copies of src/ — suppress pre-existing violations
  // that existed before the scaffold migration (Task 11)
  {
    files: ['web/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-unused-expressions': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'react/prop-types': 'off',
      'react/no-unescaped-entities': 'off',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'no-empty': 'warn',
    },
  },
]);
