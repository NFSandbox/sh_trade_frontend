import next from "@next/eslint-plugin-next";
import prettier from "eslint-config-prettier";

export default [
  {
    plugins: { "@next/next": next },
    rules: {
      ...next.configs["recommended"].rules,
      ...next.configs["core-web-vitals"].rules,
    },
  },
  { plugins: { prettier } },
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "warn",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
