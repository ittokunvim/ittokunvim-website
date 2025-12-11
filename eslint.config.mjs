import { defineConfig } from "eslint/config";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([{
    extends: [...nextCoreWebVitals, ...nextTypescript],
    rules: {
        "@next/next/no-img-element": "off",
        semi: ["error", "always"],
        quotes: ["error", "double"],

        camelcase: ["error", {
            properties: "never",
            ignoreImports: true,
        }],
    },
}]);
