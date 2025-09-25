/** @type {import('@commitlint/types').UserConfig} */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Betreff: frei formuliert, aber kein Sentence-Case
    'subject-case': [2, 'never', ['sentence-case']],
    // Scopes: kebab-case, beschränkt auf definierte Domänen (Labels)
    'scope-case': [2, 'always', 'kebab-case'],
    'scope-enum': [
      2,
      'always',
      ['db', 'ui', 'tests', 'seo', 'hotfix', 'api', 'ci', 'build', 'refactor'],
    ],
  },
}
