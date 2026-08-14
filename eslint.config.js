import {
  default as openreachtechConfig,
  coreRuleOptionHash,
} from '@openreachtech/eslint-config'

export default [
  ...openreachtechConfig,

  {
    ignores: [
      // dist/ is generated build output (see the flatten skill), not source.
      './dist/**',

      './kit/**',
      './playground/**',
    ],
  },

  {
    languageOptions: {
      globals: {
        constructorSpy: 'readonly',
      },
    },
  },

  {
    files: [
      'tests/**/*.js',
    ],
    rules: {
      'max-classes-per-file': 'off',
    },
  },

  {
    rules: {
      'no-shadow': [
        'error',
        {
          allow: [
            ...coreRuleOptionHash['no-shadow'].allow,

            'require',
          ],
        },
      ],
    },
  },
]
