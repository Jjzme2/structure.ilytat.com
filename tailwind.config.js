/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./client/components/**/*.{js,vue,ts}",
        "./client/layouts/**/*.vue",
        "./client/pages/**/*.vue",
        "./client/plugins/**/*.{js,ts}",
        "./client/app.vue",
        "./client/error.vue",
    ],
    theme: {
        extend: {
            colors: {
                primary: 'var(--bg-primary)',
                text: 'var(--text-primary)',
                muted: 'var(--text-secondary)',
                accent: 'var(--accent-primary)',
                secondary: 'var(--accent-secondary)',
            },
            fontFamily: {
                sans: ['var(--font-text)', 'sans-serif'],
                display: ['var(--font-heading)', 'sans-serif'],
                mono: ['Roboto Mono', 'monospace'],
            }
        },
    },
    plugins: [],
}
