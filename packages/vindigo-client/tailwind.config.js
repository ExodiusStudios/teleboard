/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const colors = require('tailwindcss/colors');

/* eslint-disable no-undef */
module.exports = {
	mode: 'jit',
	purge: ['./src/**/*.{vue,ts}'],
	darkMode: 'class',
	important: true,
	theme: {
		extend: {
			colors: {
				'gray': colors.trueGray,
				'primary': '#4036b5', // accent-3

				'light': '#FFFFFF',
				'light-1': '#FAF8FE',
				'light-2': '#e1e4ee',
				'light-3': '#e5e5e5',
				'light-4': '#2f3a41',
				'light-5': '#293238',

				'dark': '#0f0f0f',
				'dark-1': '#171717',
				'dark-2': '#262626',
				'dark-3': "#35353a",
				'dark-4': "#272c2f",
				'dark-5': "#343d42",

				'accent-1': '#8b5cf6',
				'accent-2': '#6159eb',
				'accent-3': '#4036b5',
				'accent-4': '#4036b5',
			}
		},
		fontFamily: {
			'sans': ['Rubik', 'ui-sans-serif', 'system-ui'],
			'mono': ['JetBrains Mono', 'ui-monospace', 'Consolas', 'system-ui']
		},
		container: {
			center: true,
			padding: '2rem'
		},
		screens: {
			'mobile': '640px',
			'laptop': '1024px',
			'desktop': '1400px'
		},
	},
	variants: {
		extend: {},
	},
	plugins: [],
};
