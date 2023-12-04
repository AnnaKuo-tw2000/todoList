/* eslint-env node */
require("@rushstack/eslint-patch/modern-module-resolution");

const path = require("node:path");
const createAliasSetting = require("@vue/eslint-config-airbnb/createAliasSetting");

module.exports = {
    root: true,
    extends: [
        "plugin:vue/vue3-essential",
        "@vue/eslint-config-airbnb",
        "./.eslintrc-auto-import.json",
    ],
    rules: {
        indent: "off",
        quotes: "off",
        "vue/html-indent": "off",
        "vuejs-accessibility/click-events-have-key-events": "off",
        "vue/first-attribute-linebreak": "off",
        "comma-dangle": "off",
        camelcase: "off",
        "import/extensions": ["error", { mjs: "always" }],
        "vue/max-attributes-per-line": "off",
        "no-use-before-define": "off",
        "vue/max-len": "off",
        "import/no-extraneous-dependencies": "off",
    },
    settings: {
        ...createAliasSetting({
            "@": `${path.resolve(__dirname, "./src")}`,
        }),
    },
    parserOptions: {
        ecmaVersion: "latest",
    },
};
