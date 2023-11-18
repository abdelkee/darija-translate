import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // primary: '#004080',
        // secondary: '#FFA500',
        // accent: '#556B2F',
        // highlight: '#87CEEB',
        // bg: '#F5F5F5',
        // typography: '#333333',
        // neutral: '#ffffff'
        primary: '#B22222',
        secondary: '#6050DC',
        accent: '#FF6F61',
        highlight: '#E6AF2E',
        bg: '#FFFDFB',
        typography: '#008080',
        neutral: '#ffffff'
      }
    },
  },
  plugins: [],
}
export default config
