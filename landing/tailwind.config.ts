import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/modules/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        dark: {
          bg: '#0a0a0f',
          surface: '#12121a',
          card: '#1a1a2e',
          border: '#2a2a4a',
          hover: '#252542',
          muted: '#6b6b8a',
        },
        light: {
          bg: '#f8fafc',
          surface: '#ffffff',
          card: '#ffffff',
          border: '#e2e8f0',
          hover: '#f1f5f9',
          muted: '#64748b',
        },
        brand: {
          purple: '#a855f7',
          indigo: '#6366f1',
          gradient: {
            from: '#6366f1',
            to: '#a855f7',
          },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #6366f1, #a855f7)',
        'gradient-brand-hover': 'linear-gradient(to right, #4f46e5, #9333ea)',
      },
    },
  },
  plugins: [],
};

export default config;
