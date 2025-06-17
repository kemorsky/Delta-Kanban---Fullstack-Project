/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: './tailwind.config.ts',
    autoprefixer: {}
  },
};

export default config;