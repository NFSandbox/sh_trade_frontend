import next from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";
import typescript from "typescript-eslint";
import eslint from "@eslint/js";

export default [
  // Next.js related configs
  {
    plugins: { "@next/next": next },
    rules: {
      ...next.configs["recommended"].rules,
      ...next.configs["core-web-vitals"].rules,
    },
  },

  // Typescript Eslint
  ...typescript.config(
    eslint.configs.recommended,
    typescript.configs.recommended,
  ),

  // Custom Configs
  {
    plugins: {
      prettier: prettier,
      "typescript-eslint": typescript,
    },
  },
  {
    rules: {
      "prefer-const": "warn",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  { ignores: ["node_modules/"] },
];
