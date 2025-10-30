import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    './src/layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Space Grotesk', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#F7FAFC",
            foreground: "#0F1724",
            divider: "#E2E8F0",
            focus: "#0B8F6B",
            content1: "#FFFFFF",
            content2: "#F1F5F9",
            content3: "#E2E8F0",
            content4: "#CBD5E1",
            default: {
              DEFAULT: "#E2E8F0",
              foreground: "#0F1724",
            },
            primary: {
              DEFAULT: "#0B8F6B",
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#EDF7F4",
              foreground: "#054036",
            },
            success: {
              DEFAULT: "#16A34A",
              foreground: "#FFFFFF",
            },
            warning: {
              DEFAULT: "#FBBF24",
              foreground: "#231A00",
            },
            danger: {
              DEFAULT: "#DC2626",
              foreground: "#FFFFFF",
            },
          },
        },
        dark: {
          colors: {
            background: "#0F1724",
            foreground: "#E6EEF3",
            divider: "#2B3440",
            focus: "#21A179",
            content1: "#0E1B26",
            content2: "#152032",
            content3: "#2B3440",
            content4: "#374151",
            default: {
              DEFAULT: "#2B3440",
              foreground: "#E6EEF3",
            },
            primary: {
              DEFAULT: "#21A179",
              foreground: "#FFFFFF",
            },
            secondary: {
              DEFAULT: "#152032",
              foreground: "#BFE9DF",
            },
            success: {
              DEFAULT: "#16A34A",
              foreground: "#05230B",
            },
            warning: {
              DEFAULT: "#F59E0B",
              foreground: "#251500",
            },
            danger: {
              DEFAULT: "#E02424",
              foreground: "#FFFFFF",
            },
          },
        },
      },
    }),
  ],
};