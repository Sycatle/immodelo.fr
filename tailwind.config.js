// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
	theme: {
		extend: {
			colors: {
				primary: {
					DEFAULT: "#f97316", // orange-500
					hover: "#ea580c", // orange-600
				},
			},
		},
	},
	plugins: [
	],
};
