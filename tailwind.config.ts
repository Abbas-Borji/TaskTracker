import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        primary: "#1A87EF",
        dark: "#1F2937",
        light: "#F5F5F5",
        success: "#00BF63",
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("flowbite/plugin")],
} satisfies Config;
