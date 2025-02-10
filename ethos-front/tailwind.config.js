/** @type {import('tailwindcss').Config} */
export default {
content: [
	"./index.html",
	"./src/**/*.{js,ts,jsx,tsx}",
],
darkMode: 'class',
theme: {
	extend: {
		backgroundImage: {
			'light-pattern': "url('src/assets/darkness.webp')",
			'dark-pattern': "#000000",
		}
	},
},
plugins: [
    require('@tailwindcss/forms'),
	require('@tailwindcss/typography')
],

}
