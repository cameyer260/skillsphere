// import js from "@eslint/js";
// import globals from "globals";
// import tseslint from "typescript-eslint";
// import pluginReact from "eslint-plugin-react";
// import { defineConfig } from "eslint/config";
//
// export default defineConfig([
//   {
//     files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
//     plugins: { js },
//     extends: ["js/recommended"],
//   },
//   {
//     files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
//     languageOptions: { globals: { ...globals.browser, ...globals.node } },
//   },
//   tseslint.configs.recommended,
//   pluginReact.configs.flat.recommended,
// ]);
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js, react: pluginReact }, // ✅ include the 'react' plugin
    rules: {
      "react/react-in-jsx-scope": "off", // ✅ rule now valid
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    extends: ["js/recommended"],
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
]);
