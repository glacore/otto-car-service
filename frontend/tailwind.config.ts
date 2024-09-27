import type { Config } from "tailwindcss";
import flowbitePlugin from "flowbite/plugin";

const config: Config = {
  content: [
    "./*.{html,ts}",
    "./index.html",
    "./node_modules/flowbite/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "base-white": "rgb(250 250 250)",
        "base-black": "rgb(11 10 10)",
        primary: "rgb(255 37 1)",
        secondary: "rgb(255 255 255)",
        success: "rgb(51 202 127)",
        warning: "rgb(244 199 144)",
        error: "rgb(253 21 27)",
        primary100: "rgb(255 224 219)",
        primary200: "rgb(255 193 182)",
        primary300: "rgb(255 162 146)",
        primary400: "rgb(255 130 110)",
        primary500: "rgb(255 99 74)",
        primary600: "rgb(255 68 37)",
        primary700: "rgb(227 32 0)",
        primary800: "rgb(198 28 0)",
        primary900: "rgb(170 24 0)",
        primary1000: "rgb(141 20 0)",
        primary1100: "rgb(112 16 0)",
        primary1200: "rgb(83 12 0)",
        secondary100: "rgb(255 255 255)",
        secondary200: "rgb(233 233 233)",
        secondary300: "rgb(211 211 211)",
        secondary400: "rgb(189 189 189)",
        secondary500: "rgb(167 167 167)",
        secondary600: "rgb(145 145 145)",
        secondary700: "rgb(123 123 123)",
        secondary800: "rgb(101 101 101)",
        secondary900: "rgb(79 79 79)",
        secondary1000: "rgb(57 57 57)",
        neutrals100: "rgb(232 231 231)",
        neutrals200: "rgb(213 213 213)",
        neutrals300: "rgb(195 194 194)",
        neutrals400: "rgb(177 175 175)",
        neutrals500: "rgb(160 156 156)",
        neutrals600: "rgb(142 137 137)",
        neutrals700: "rgb(124 118 118)",
        neutrals800: "rgb(106 100 100)",
        neutrals900: "rgb(87 81 81)",
        neutrals1000: "rgb(68 63 63)",
        neutrals1100: "rgb(49 45 45)",
        neutrals1200: "rgb(30 28 28)",
        success100: "rgb(204 242 223)",
        success200: "rgb(152 229 191)",
        success300: "rgb(101 216 159)",
        success400: "rgb(40 157 98)",
        success500: "rgb(28 111 70)",
        warning100: "rgb(251 236 218)",
        warning200: "rgb(248 218 181)",
        warning300: "rgb(237 166 78)",
        warning400: "rgb(221 131 22)",
        warning500: "rgb(155 92 15)",
        error100: "rgb(255 196 198)",
        error200: "rgb(254 138 141)",
        error300: "rgb(254 79 84)",
        error400: "rgb(210 2 7)",
        error500: "rgb(148 1 5)",
        glass100: "rgb(250 250 250 / 0.03)",
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      borderRadius: {
        none: "0",
        xs: "0.125rem",
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.625rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2.25rem",
        full: "9999px",
      },
      fontSize: {
        "display-1": ["9rem", { lineHeight: "1.2", fontWeight: "700" }],
        "display-2": ["6rem", { lineHeight: "1.2", fontWeight: "700" }],
        "display-3": ["4rem", { lineHeight: "1.2", fontWeight: "700" }],
        h1: ["3.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        h2: ["3rem", { lineHeight: "1.2", fontWeight: "700" }],
        h3: ["2.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        h4: ["2rem", { lineHeight: "1.2", fontWeight: "700" }],
        hero: ["1.75rem", { lineHeight: "1.2" }],
        feature: ["1.5rem", { lineHeight: "1.2" }],
        highlight: ["1.125rem", { lineHeight: "1.2" }],
        content: ["1rem", { lineHeight: "1.2" }],
        caption: ["0.875rem", { lineHeight: "1.2" }],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        semibold: "600",
        bold: "700",
      },
      keyframes: {
        "slide-left": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-100%)" },
        },
      },
      animation: {
        "slide-left-infinite": "slide-left 30s linear infinite",
      },
    },
  },
  plugins: [flowbitePlugin],
  safelist: ["peer-checked:text-primary", "peer-checked:border-primary"],
};

export default config;
