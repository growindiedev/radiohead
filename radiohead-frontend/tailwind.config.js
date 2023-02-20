/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",

		// Or if using `src` directory:
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			animation: {
				marquee: "marquee 25s linear infinite",
				marquee2: "marquee2 25s linear infinite",
			},
			keyframes: {
				marquee: {
					"0%": { transform: "translateX(0%)" },
					"100%": { transform: "translateX(-100%)" },
				},
				marquee2: {
					"0%": { transform: "translateX(100%)" },
					"100%": { transform: "translateX(0%)" },
				},
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		//themes: ["light", "dark", "cupcake", "bumblebee", "emerald", "corporate", "synthwave", "retro", "cyberpunk", "valentine",
		//"halloween", "garden", "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black", "luxury", "dracula",
		//"cmyk", "autumn", "business", "acid", "lemonade", "night", "coffee", "winter"],
		themes: ["cyberpunk"],
	},
};
