import type { Config } from 'tailwindcss'

export default {
      content: ["./src/**/*.{js,ts,tsx,jsx}"],
      theme: {
        extend: {
          colors: {
            primary: '#111827',
            secondary: '#1F2937',
            tertiary: '#374151',
            'border-accent': '#4073ffb0'
          },
          fontFamily: {
            secondary: ['Montserrat', 'sans-serif'],
          }
        },
      },
      plugins: [],
} satisfies Config;