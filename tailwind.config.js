/* eslint no-undef: "error" */
/* eslint-env node */
/** @type {import('tailwindcss').Config} */

module.exports = {
    content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
    theme: {
        screens: {
            md: "768px",
        },
        extend: {
            colors: {
                // 樣式
                primary: "#ffcc00",

                // 樣式：黑夜模式
                dkPrimary: "#202124",
                dkSecondary: "#353535",
                dkTertiary: "#d19327",

                // 文字
                txPrimary: "#4a4a4a",
                txSecondary: "#bebebe",

                // 文字：黑夜模式
                dkTxPrimary: "#d4d4d4",
            },
        },
    },
    darkMode: "class",
};
