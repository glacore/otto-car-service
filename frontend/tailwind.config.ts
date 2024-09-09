import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{html,ts}", "./index.html"],
  theme: {
    extend: {
      colors: {
        "base-white": "rgba(250, 250, 250, 1)",
        "base-black": "rgba(11, 10, 10, 1)",
        primary: "rgba(255, 37, 1, 1)",
        secondary: "rgba(255, 255, 255, 1)",
        success: "rgba(51, 202, 127, 1)",
        warning: "rgba(244, 199, 144, 1)",
        error: "rgba(253, 21, 27, 1)",
        primary100: "rgba(255, 224, 219, 1)",
        primary200: "rgba(255, 193, 182, 1)",
        primary300: "rgba(255, 162, 146, 1)",
        primary400: "rgba(255, 130, 110, 1)",
        primary500: "rgba(255, 99, 74, 1)",
        primary600: "rgba(255, 68, 37, 1)",
        primary700: "rgba(227, 32, 0, 1)",
        primary800: "rgba(198, 28, 0, 1)",
        primary900: "rgba(170, 24, 0, 1)",
        primary1000: "rgba(141, 20, 0, 1)",
        primary1100: "rgba(112, 16, 0, 1)",
        primary1200: "rgba(83, 12, 0, 1)",
        secondary100: "rgba(255, 255, 255, 1)",
        secondary200: "rgba(233, 233, 233, 1)",
        secondary300: "rgba(211, 211, 211, 1)",
        secondary400: "rgba(189, 189, 189, 1)",
        secondary500: "rgba(167, 167, 167, 1)",
        secondary600: "rgba(145, 145, 145, 1)",
        secondary700: "rgba(123, 123, 123, 1)",
        secondary800: "rgba(101, 101, 101, 1)",
        secondary900: "rgba(79, 79, 79, 1)",
        secondary1000: "rgba(57, 57, 57, 1)",
        neutrals100: "rgba(232, 231, 231, 1)",
        neutrals200: "rgba(213, 213, 213, 1)",
        neutrals300: "rgba(195, 194, 194, 1)",
        neutrals400: "rgba(177, 175, 175, 1)",
        neutrals500: "rgba(160, 156, 156, 1)",
        neutrals600: "rgba(142, 137, 137, 1)",
        neutrals700: "rgba(124, 118, 118, 1)",
        neutrals800: "rgba(106, 100, 100, 1)",
        neutrals900: "rgba(87, 81, 81, 1)",
        neutrals1000: "rgba(68, 63, 63, 1)",
        neutrals1100: "rgba(49, 45, 45, 1)",
        neutrals1200: "rgba(30, 28, 28, 1)",
        success100: "rgba(204, 242, 223, 1)",
        success200: "rgba(152, 229, 191, 1)",
        success300: "rgba(101, 216, 159, 1)",
        success400: "rgba(40, 157, 98, 1)",
        success500: "rgba(28, 111, 70, 1)",
        warning100: "rgba(251, 236, 218, 1)",
        warning200: "rgba(248, 218, 181, 1)",
        warning300: "rgba(237, 166, 78, 1)",
        warning400: "rgba(221, 131, 22, 1)",
        warning500: "rgba(155, 92, 15, 1)",
        error100: "rgba(255, 196, 198, 1)",
        error200: "rgba(254, 138, 141, 1)",
        error300: "rgba(254, 79, 84, 1)",
        error400: "rgba(210, 2, 7, 1)",
        error500: "rgba(148, 1, 5, 1)",
        glass100: "rgba(250, 250, 250, 0.03)",
      },
      fontFamily: {
        sora: ["Sora", "sans-serif"],
        inter: ["Inter", "sans-serif"],
      },
      borderRadius: {
        none: "0rem",
        xs: "0.125rem",
        sm: "0.25rem",
        md: "0.375rem",
        lg: "0.625rem",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2.25rem",
        full: "62.4375rem",
      },
      fontSize: {
        "display-1": ["9rem", { lineHeight: "1.2", fontWeight: "700" }], // 144px
        "display-2": ["6rem", { lineHeight: "1.2", fontWeight: "700" }], // 96px
        "display-3": ["4rem", { lineHeight: "1.2", fontWeight: "700" }], // 64px
        h1: ["3.5rem", { lineHeight: "1.2", fontWeight: "700" }], // 56px
        h2: ["3rem", { lineHeight: "1.2", fontWeight: "700" }], // 48px
        h3: ["2.5rem", { lineHeight: "1.2", fontWeight: "700" }], // 40px
        h4: ["2rem", { lineHeight: "1.2", fontWeight: "700" }], // 32px
        hero: ["1.75rem", { lineHeight: "1.2" }], // 28px
        feature: ["1.5rem", { lineHeight: "1.2" }], // 24px
        highlight: ["1.125rem", { lineHeight: "1.2" }], // 18px
        content: ["1rem", { lineHeight: "1.2" }], // 16px
        caption: ["0.875rem", { lineHeight: "1.2" }], // 14px
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
        "slide-left-infinite": "infinite slide-left 30s linear  ",
      },
    },
  },
  plugins: [],
};

export default config;
