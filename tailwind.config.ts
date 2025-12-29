import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                barberia: {
                    dark: "#1A1A1A",
                    gold: "#D4AF37",
                },
                salon: {
                    beige: "#EBDECF",
                    white: "#FFFFFF",
                },
            },
        },
    },
    plugins: [],
};
export default config;
