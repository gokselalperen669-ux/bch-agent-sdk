/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'primary-color': '#00E339',
                'primary-dark': '#00b32d',
                'text-primary': '#ffffff',
                'text-secondary': '#949BA4',
                'text-tertiary': '#5e646e',
                'accent-color': '#58a6ff',
                'danger-color': '#ff4d4d',
                'success-color': '#00E339',
                'bg-color': '#030405',
            },
            fontFamily: {
                'title': ['Outfit', 'sans-serif'],
                'sans': ['Inter', 'sans-serif'],
                'mono': ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
