import next from 'eslint-config-next';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        ...next,
    },
];
