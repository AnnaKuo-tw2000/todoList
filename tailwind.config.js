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
                primary: "#ffcc00",
                secondary: "#4a4a4a",
                tertiary: "#bebebe",
            },
        },
    },
};
