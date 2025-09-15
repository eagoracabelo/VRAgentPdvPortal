import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import sonarjs from 'eslint-plugin-sonarjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: [
      '**/node_modules',
      '**/dist',
      '**/coverage',
      '**/db',
      '**/*spec.ts',
      '**/*mock.ts',
      '**/*.html',
    ],
  },
  ...compat
    .extends(
      'plugin:@angular-eslint/recommended',
      'plugin:@angular-eslint/template/process-inline-templates',
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended',
      'plugin:@typescript-eslint/recommended-requiring-type-checking',
      'plugin:prettier/recommended',
    )
    .map((config) => ({
      ...config,
      files: ['**/*.ts'],
    })),
  {
    files: ['**/*.ts'],

    plugins: {
      prettier,
      sonarjs,
    },

    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true,
      },
    },

    rules: {
      '@typescript-eslint/unbound-method': [
        'error',
        {
          ignoreStatic: true,
        },
      ],

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          varsIgnorePattern: '^_$',
          argsIgnorePattern: '^_$',
          caughtErrorsIgnorePattern: '^_$',
        },
      ],
      '@typescript-eslint/no-unsafe-enum-comparison': 'off',
      'sonarjs/no-duplicate-string': ['error', { threshold: 20 }],
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/explicit-function-return-type': 'error',
    },
  },
  ...compat.extends('plugin:prettier/recommended').map((config) => ({
    ...config,
    files: ['**/*.html'],
  })),
  {
    files: ['**/*.html'],
    rules: {},
  },
];
