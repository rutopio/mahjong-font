import path from "node:path";
import { fileURLToPath } from "node:url";
import _import from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import { defineConfig, globalIgnores } from "eslint/config";

import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tailwind from "@hyoban/eslint-plugin-tailwindcss";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

// Helper function for Tailwind CSS config
function findTailwindImportCss(cwd) {
  return path.join(cwd, "app/globals.css");
}

export default defineConfig([
  ...tailwind.configs["flat/recommended"],
  globalIgnores(["**/components/ui/**/*"]),
  {
    extends: fixupConfigRules(
      compat.extends(
        "next/core-web-vitals",
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:tailwindcss/recommended",
        "plugin:import/errors",
        "plugin:import/warnings",
        "plugin:prettier/recommended",
        "prettier",
      ),
    ),

    plugins: {
      prettier: fixupPluginRules(prettier),
      tailwindcss: fixupPluginRules(tailwind),
      import: fixupPluginRules(_import),
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "module",

      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: ".",
      },
    },

    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },

        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx"],
          moduleDirectory: ["node_modules", "."],
        },

        tailwindcss: {
          config: findTailwindImportCss(process.cwd()),
        },
      },

      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
    },

    rules: {
      "prettier/prettier": "warn",
      "tailwindcss/no-custom-classname": "off",
      "tailwindcss/classnames-order": "off",
      "tailwindcss/enforces-shorthand": "off",
      "react-hooks/exhaustive-deps": "off",
      "import/no-named-as-default-member": "off",
      "import/no-named-as-default": "off",
      "@next/next/no-img-element": "off",
      "@typescript-eslint/no-explicit-any": "off",

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
    },
  },
]);
