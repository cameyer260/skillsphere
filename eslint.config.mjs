import nextConfig from 'eslint-config-next';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    rules: {
      ...nextConfig.rules, // spread only the rules, not the whole object
    },
    settings: {
      ...nextConfig.settings, // optional, if needed
    },
    plugins: {
      ...nextConfig.plugins, // optional, only if you need plugin references
    },
  },
];
