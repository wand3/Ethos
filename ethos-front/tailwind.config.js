const { fontFamily } = require("tailwindcss/defaultTheme");
const Unfonts = require("unplugin-fonts");

/** @type {import('tailwindcss').Config} */
export default {
content: [
	"./index.html",
	"./src/**/*.{js,ts,jsx,tsx}",
],
darkMode: 'class',
theme: {
	extend: {
		// for setting background images 
		// backgroundImage: {
		// 	'light-pattern': "url('src/assets/darkness.webp')",
		// 	'dark-pattern': "#000000",
		// }
		colors: {
        color: {
          1: "#ffc876",
          2: "#FFC876",
          3: "#d9ccae8f",
          4: "#7ADB78",
          5: "#858DFF",
          6: "#FF98E2",
        },
        stroke: {
          1: "#26242C",
        },
        n: {
          1: "#000000",
          2: "#CAC6DD",
          3: "#ADA8C3",
          4: "#757185",
          5: "#3F3A52",
          6: "#252134",
          7: "#15131D",
          8: "#F4F2F0",
          9: "#474060",
          10: "#43435C",
          11: "#1B1B2E",
          12: "#2E2A41",
          13: "#6C7275",
        },
      },
    
    fontFamily: {
      poppins: ["Poppins", ...fontFamily.sans],
      oswald: ["Oswald", ...fontFamily.sans],
    },
    letterSpacing: {
      tagline: ".15em",
    },
      spacing: {
        0.25: "0.0625rem",
        7.5: "1.875rem",
        15: "3.75rem",
      },
      opacity: {
        15: ".15",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
      transitionTimingFunction: {
        DEFAULT: "linear",
      },
      zIndex: {
        1: "1",
        2: "2",
        3: "3",
        4: "4",
        5: "5",
      },
      borderWidth: {
        DEFAULT: "0.0625rem",
      },
      backgroundImage: {
        "radial-gradient": "radial-gradient(var(--tw-gradient-stops))",
        "conic-gradient":
          "conic-gradient(from 225deg, #FFC876, #79FFF7, #9F53FF, #FF98E2, #FFC876)",
      },
	},
},
plugins: [
    require('@tailwindcss/forms'),
	require('@tailwindcss/typography')
],

}
