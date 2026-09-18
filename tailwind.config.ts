import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#050811",       // Pitch black with deep sapphire undertone
          secondary: "#080E1E",     // Dark midnight blue
          tertiary: "#0D162F",      // Elevated rich navy
          card: "#0A1024",          // Deep blue-black glassmorphic card
          cardHover: "#111C3B",     // Royal blue-black hover state
          glass: "rgba(10, 16, 36, 0.85)",
        },
        border: {
          subtle: "rgba(59, 130, 246, 0.12)",
          hover: "rgba(96, 165, 250, 0.28)",
          glow: "rgba(59, 130, 246, 0.55)",
        },
        accent: {
          indigo: "#3B82F6",         // Electric Royal Blue (Primary Accent)
          indigoGlow: "rgba(59, 130, 246, 0.35)",
          blue: "#2563EB",           // Deep Vibrant Blue
          cyan: "#38BDF8",           // Cyber Azure / Sky Blue
          cyanGlow: "rgba(56, 189, 248, 0.3)",
          violet: "#6366F1",         // Indigo Violet
          emerald: "#10B981",
          amber: "#F59E0B",
          rose: "#F43F5E",
        },
        foreground: {
          DEFAULT: "#F1F5F9",
          muted: "#94A3B8",
          subtle: "#64748B",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "-apple-system", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "radial-highlight": "radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.25) 0%, transparent 68%)",
        "radial-cyan-glow": "radial-gradient(circle at 100% 0%, rgba(56, 189, 248, 0.18) 0%, transparent 55%)",
        "radial-blue-mesh": "radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.18) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(29, 78, 216, 0.15) 0px, transparent 50%)",
        "glass-gradient": "linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(255, 255, 255, 0.01) 100%)",
      },
      boxShadow: {
        "glow-indigo": "0 0 28px -4px rgba(59, 130, 246, 0.45)",
        "glow-blue": "0 0 32px -4px rgba(37, 99, 235, 0.55)",
        "glow-cyan": "0 0 28px -4px rgba(56, 189, 248, 0.4)",
        "glass": "0 12px 40px 0 rgba(0, 0, 0, 0.65)",
        "subtle-card": "0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px -1px rgba(0, 0, 0, 0.3)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-in": "fadeIn 0.25s ease-out forwards",
        "slide-up": "slideUp 0.3s ease-out forwards",
        "slide-left": "slideLeft 0.3s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideLeft: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
