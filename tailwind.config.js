const {nextui} = require("@nextui-org/react");
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./public/index.php",
        "./resources/js/**/*.{js,ts,jsx,tsx}",
        "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {},
    },
    plugins: [nextui()],
}

