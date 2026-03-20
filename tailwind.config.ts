import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6', // Blue-500
        secondary: '#60A5FA', // Blue-400
        accent: '#1D4ED8', // Blue-700
        text: '#1F2937', // Gray-800
        background: '#F9FAFB', // Gray-50
        error: '#EF4444', // Red-500
        success: '#22C55E', // Green-500
      },
    },
  },
  plugins: [],
};
export default config;