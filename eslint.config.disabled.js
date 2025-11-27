import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";

export default [
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
  },
];
