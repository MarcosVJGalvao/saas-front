import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import importPlugin from 'eslint-plugin-import';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import unusedImports from 'eslint-plugin-unused-imports';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules', 'vitest.config.ts'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommendedTypeChecked],
    files: ['src/**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      'jsx-a11y': jsxA11y,
      prettier: prettierPlugin,
      'unused-imports': unusedImports,
    },
    settings: { 'import/resolver': { typescript: true } },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': 'off',
      'prettier/prettier': 'error',
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 0, maxBOF: 0 }],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      'padded-blocks': ['error', 'never'],
      'id-length': ['error', { min: 2, exceptions: ['i', 'j', '_'], properties: 'never' }],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'error',
        { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/consistent-type-assertions': ['error', { assertionStyle: 'never' }],
      'no-restricted-syntax': [
        'error',
        {
          selector: "TSAsExpression > TSTypeReference > Identifier[name='const']",
          message: 'as const não é permitido fora de testes.',
        },
      ],
      'import/no-default-export': 'off',
    },
  },
  {
    files: ['src/pages/**/*.{ts,tsx}'],
    rules: {
      complexity: ['error', 3],
      'no-restricted-imports': [
        'error',
        {
          patterns: ['../services/*', '../hooks/*', '../utils/*', '@/services/*'],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.name=/^use(State|Effect|Memo|Callback|Reducer|Ref)$/]",
          message: 'Pages devem ser composição; mova lógica para hooks.',
        },
        {
          selector:
            "CallExpression[callee.object.name=/.+Service$/], CallExpression[callee.object.name=/.+Client$/]",
          message: 'Pages não devem chamar services/clients diretamente; use hooks.',
        },
      ],
    },
  },
  {
    files: ['src/components/common/**/*.{ts,tsx}'],
    rules: {
      complexity: ['error', 12],
      'no-restricted-imports': [
        'error',
        { patterns: ['../services/*', '../../services/*', '@/services/*'] },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.object.name=/.+Service$/], CallExpression[callee.object.name=/.+Client$/]",
          message: 'Componentes comuns não devem chamar services/clients; use hooks.',
        },
      ],
    },
  },
  {
    files: ['src/components/**/*.{ts,tsx}'],
    ignores: ['src/components/common/**/*.{ts,tsx}'],
    rules: {
      complexity: ['error', 8],
      'no-restricted-imports': [
        'error',
        { patterns: ['../services/*', '../../services/*', '@/services/*'] },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.object.name=/.+Service$/], CallExpression[callee.object.name=/.+Client$/]",
          message: 'Componentes não devem chamar services/clients diretamente; use hooks.',
        },
      ],
    },
  },
  {
    files: ['src/test/**/*.{ts,tsx}', '**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/consistent-type-assertions': 'off',
      '@typescript-eslint/unbound-method': 'off',
      'no-restricted-syntax': 'off',
      'id-length': 'off',
    },
  },
);

