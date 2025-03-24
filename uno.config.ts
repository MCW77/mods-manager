import {
	defineConfig,
	presetWind3,
	presetIcons,
	presetTypography,
} from "unocss";
import presetAnimations from "unocss-preset-animations";
import presetShadcn from "unocss-preset-shadcn";

export default defineConfig({
	presets: [
		presetWind3(),
		presetAnimations(),
		presetIcons(),
		presetShadcn(),
		presetTypography(),
	],
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			keyframes: {
				"accordion-down": {
					from: { height: 0 },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: 0 },
				},
				"spin-slow": {
					from: { transform: "rotate(0deg)" },
					to: { transform: "rotate(360deg)" },
				},
				"spin-slow-reverse": {
					from: { transform: "rotate(360deg)" },
					to: { transform: "rotate(0deg)" },
				},
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"spin-slow": "spin-slow 2s linear infinite",
				"spin-slow-reverse": "spin-slow-reverse 2s linear infinite",
			},
		},
	},
});
