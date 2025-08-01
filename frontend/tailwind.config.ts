import type { Config } from 'tailwindcss'

export default {
      content: ["./src/**/*.{js,ts,tsx,jsx}"],
      theme: {
        extend: {
          fontFamily: {
            secondary: ['Nata Sans', 'sans-serif'],
          }
        },
      },
      plugins: [],
} satisfies Config;