module.exports = {
    env: {
        browser: true,
        es6: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        sourceType: "module",
    },
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended-type-checked",
        // "plugin:@typescript-eslint/stylistic-type-checked",
    ],
};
