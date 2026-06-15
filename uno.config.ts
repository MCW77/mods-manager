import {
	defineConfig,
	presetWind4,
	presetIcons,
	presetTypography,
} from "unocss";
import presetAnimations from "unocss-preset-animations";
import presetShadcn from "unocss-preset-shadcn";

export default defineConfig({
	content: {
		filesystem: ["src/**/*.{js,ts,jsx,tsx}", "index.html"],
	},
	variants: [
		(matcher) => {
			if (!matcher.startsWith("aria-invalid:")) return;
			const m = matcher.slice("aria-invalid:".length);
			return {
				matcher: m,
				selector: (s) => `${s}[aria-invalid="true"]`,
			};
		},
		(matcher) => {
			if (!matcher.startsWith("data-active:")) return;
			const m = matcher.slice("data-active:".length);
			return {
				matcher: m,
				selector: (s) => `${s}[data-active]`,
			};
		},
		(matcher) => {
			if (!matcher.startsWith("data-checked:")) return;
			const m = matcher.slice("data-checked:".length);
			return {
				matcher: m,
				selector: (s) => `${s}[data-checked]`,
			};
		},
		(matcher) => {
			if (!matcher.startsWith("data-unchecked:")) return;
			const m = matcher.slice("data-unchecked:".length);
			return {
				matcher: m,
				selector: (s) => `${s}[data-unchecked]`,
			};
		},
		(matcher) => {
			if (!matcher.startsWith("data-disabled:")) return;
			const m = matcher.slice("data-disabled:".length);
			return {
				matcher: m,
				selector: (s) => `${s}[data-disabled]`,
			};
		},
		(matcher) => {
			if (!matcher.startsWith("data-open:")) return;
			const m = matcher.slice("data-open:".length);
			return {
				matcher: m,
				selector: (s) => `${s}[data-open]`,
			};
		},
		(matcher) => {
			if (!matcher.startsWith("data-closed:")) return;
			const m = matcher.slice("data-closed:".length);
			return {
				matcher: m,
				selector: (s) => `${s}[data-closed]`,
			};
		},
		(matcher) => {
			if (!matcher.startsWith("data-inset:")) return;
			const m = matcher.slice("data-inset:".length);
			return {
				matcher: m,
				selector: (s) => `${s}[data-inset]`,
			};
		},
		(matcher) => {
			if (!matcher.startsWith("data-popup-open:")) return;
			const m = matcher.slice("data-popup-open:".length);
			return {
				matcher: m,
				selector: (s) => `${s}[data-popup-open]`,
			};
		},
		(matcher) => {
			if (!matcher.startsWith("data-horizontal:")) return;
			const m = matcher.slice("data-horizontal:".length);
			return {
				matcher: m,
				selector: (s) => `${s}[data-orientation="horizontal"]`,
			};
		},
		(matcher) => {
			if (!matcher.startsWith("data-vertical:")) return;
			const m = matcher.slice("data-vertical:".length);
			return {
				matcher: m,
				selector: (s) => `${s}[data-orientation="vertical"]`,
			};
		},
		(matcher) => {
			if (!matcher.startsWith("group-data-horizontal\/tabs:")) return matcher;
			const m = matcher.slice("group-data-horizontal\/tabs:".length);
			return {
				matcher: m,
				selector: (s) =>
					`${s}:is(:where(.group\\/tabs):where([data-orientation="horizontal"]) *)`,
			};
		},
		(matcher) => {
			if (!matcher.startsWith("group-data-vertical\/tabs:")) return matcher;
			const m = matcher.slice("group-data-vertical\/tabs:".length);
			return {
				matcher: m,
				selector: (s) =>
					`${s}:is(:where(.group\\/tabs):where([data-orientation="vertical"]) *)`,
			};
		},
	],
	safelist: [
		// Ensure mod color utilities are always included for dynamic usage
		"text-mod-grey",
		"text-mod-green",
		"text-mod-blue",
		"text-mod-purple",
		"text-mod-gold",
		"bg-mod-grey",
		"bg-mod-green",
		"bg-mod-blue",
		"bg-mod-purple",
		"bg-mod-gold",
		"border-mod-grey",
		"border-mod-green",
		"border-mod-blue",
		"border-mod-purple",
		"border-mod-gold",
		"text-selected-foreground",
		"bg-selected",
		"border-selected-border",
	],
	rules: [
		// Custom rules to ensure mod color utilities are generated
		[
			/^text-selected-foreground$/,
			() => ({ color: "hsl(var(--selected-foreground))" }),
		],
		[/^bg-selected$/, () => ({ "background-color": "hsl(var(--selected))" })],
		[
			/^border-selected-border$/,
			() => ({ "border-color": "hsl(var(--selected-border))" }),
		],
		[
			/^text-mod-(grey|green|blue|purple|gold)$/,
			([, color]) => ({ color: `hsl(var(--mod-${color}))` }),
		],
		[
			/^bg-mod-(grey|green|blue|purple|gold)$/,
			([, color]) => ({ "background-color": `hsl(var(--mod-${color}))` }),
		],
		[
			/^border-mod-(grey|green|blue|purple|gold)$/,
			([, color]) => ({ "border-color": `hsl(var(--mod-${color}))` }),
		],
	],
	presets: [
		presetWind4({
			preflights: {
				reset: true,
			},
		}),
		presetAnimations(),
		presetIcons(),
		presetShadcn({
			color: "slate",
			darkSelector: ".dark",
		}),
		presetTypography(),
	],
	theme: {
		containers: {
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
			radius: {
				lg: "var(--radius)",
				md: "calc(var(--radius) - 2px)",
				sm: "calc(var(--radius) - 4px)",
			},
			colors: {
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				card: {
					DEFAULT: "hsl(var(--card))",
					foreground: "hsl(var(--card-foreground))",
				},
				popover: {
					DEFAULT: "hsl(var(--popover))",
					foreground: "hsl(var(--popover-foreground))",
				},
				primary: {
					DEFAULT: "hsl(var(--primary))",
					foreground: "hsl(var(--primary-foreground))",
				},
				secondary: {
					DEFAULT: "hsl(var(--secondary))",
					foreground: "hsl(var(--secondary-foreground))",
				},
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				accent: {
					DEFAULT: "hsl(var(--accent))",
					foreground: "hsl(var(--accent-foreground))",
				},
				destructive: {
					DEFAULT: "hsl(var(--destructive))",
					foreground: "hsl(var(--destructive-foreground))",
				},
				border: "hsl(var(--border))",
				input: "hsl(var(--input))",
				ring: "hsl(var(--ring))",
				chart: {
					1: "hsl(var(--chart-1))",
					2: "hsl(var(--chart-2))",
					3: "hsl(var(--chart-3))",
					4: "hsl(var(--chart-4))",
					5: "hsl(var(--chart-5))",
				},
				mod: {
					grey: "hsl(var(--mod-grey))",
					green: "hsl(var(--mod-green))",
					blue: "hsl(var(--mod-blue))",
					purple: "hsl(var(--mod-purple))",
					gold: "hsl(var(--mod-gold))",
				},
			},
		},
	},
});
