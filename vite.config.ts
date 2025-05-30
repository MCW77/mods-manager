import { defineConfig, type PluginOption } from "vite";
import UnoCSS from "unocss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";
import dynamicImport from "vite-plugin-dynamic-import";
import { visualizer } from "rollup-plugin-visualizer";



// https://vitejs.dev/config/
export default defineConfig({
	worker: {
		format: "es",
		plugins: () => [
			UnoCSS({
				mode: "global",
				hmrTopLevelAwait: false,
			}),
		],
		rollupOptions: {
			external: ['@react-refresh'],
			output: {
				intro: `
					if (typeof globalThis !== 'undefined') {
						globalThis.window = {
							__registerBeforePerformReactRefresh: () => {},
							__reactRefreshUtils: null,
							addEventListener: () => {},
							removeEventListener: () => {},
							location: {
								reload: () => {},
								replace: () => {},
								assign: () => {},
								toString: () => 'about:blank',
								href: 'about:blank',
								origin: 'null',
								protocol: 'about:',
								host: '',
								hostname: '',
								port: '',
								pathname: 'blank',
								search: '',
								hash: '',
								ancestorOrigins: { length: 0, contains: () => false, item: () => null },
							},
							console: globalThis.console || { log: () => {}, warn: () => {}, error: () => {} },
						};
						globalThis.__REACT_DEVTOOLS_GLOBAL_HOOK__ = undefined;
						globalThis.__vite_plugin_react_preamble_installed__ = true;
						globalThis.$RefreshReg$ = () => {};
						globalThis.$RefreshSig$ = () => (type) => type;
					}
				`,
			},
		},
	},
	define: {
		// Prevent React Refresh in worker context
		__REACT_DEVTOOLS_GLOBAL_HOOK__: 'undefined',
		// Completely disable React Refresh in worker context
		__vite_is_modern_browser: 'false',
		// React Refresh globals for worker context - use simple function references
		'$RefreshReg$': 'undefined',
		'$RefreshSig$': 'undefined',		// Fix for use-sync-external-store compatibility with Vite 6
		'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
	},
	optimizeDeps: {
		include: ["unocss"],
		exclude: ["@legendapp/state", "@legendapp/state/react"],
	},
	build: {
		target: "esnext",
		rollupOptions: {
			//			treeshake: true,
			input: {
				index: "index.html",
				optimizer: "src/workers/optimizer.ts",
			},
		},
	},
	plugins: [
		dynamicImport(),
		react({
			exclude: [
				/.*\.worker\.ts$/,
				/.*workers\/.*\.ts$/,
				/.*\/stateLoader\/.*\.ts$/,
				/.*\/state\/.*\.ts$/,
				/.*profilesManagement\/state\/.*$/,
				/.*compilations\/state\/.*$/,
				/.*characters\/state\/.*$/,
				/.*charactersManagement\/state\/.*$/,
				/.*about\/state\/.*$/,
				/.*hotUtils\/state\/.*$/,
				/.*incrementalOptimization\/state\/.*$/,
				/.*lockedStatus\/state\/.*$/,
				/.*modsView\/state\/.*$/,
				/.*optimizationSettings\/state\/.*$/,
				/.*templates\/state\/.*$/,
			],
		}),
		VitePWA({
			includeAssets: [
				"favicon.svg",
				"favicon.ico",
				"robots.txt",
				"apple-touch-icon.png",
			],
			manifest: {
				name: `Grandivory's Mods Optimizer`,
				short_name: "GIMO",
				description: `Grandivory's mods optimizer will allow you to equip the optimum mod set on every character you have in Star Wars: Galaxy of Heroes™. It will fetch your mods and characters, and find the best set to equip for each character in a list you provide.`,
				theme_color: "#000000",
				icons: [
					{
						src: "pwa-192x192.png",
						sizes: "192x192",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
					},
					{
						src: "pwa-512x512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable",
					},
				],
			},
		}),
		UnoCSS({
			mode: "global",
			hmrTopLevelAwait: false,
		}),
		visualizer({
			filename: "./dist/stats.html",
			open: true,
		}) as PluginOption,
	],
	resolve: {
		alias: {
			"#": path.resolve(__dirname, "./src"),
			"#lib": path.resolve(__dirname, "./src/lib"),
			"#ui": path.resolve(__dirname, "./src/components/ui"),
			'use-sync-external-store/shim/index.js': 'react',
		},
		conditions: ["import", "module", "browser", "default"],
		mainFields: ["module", "main"],
	},
	server: {
		port: 3000,
		hmr: {
			port: 3001,
			overlay: false,
		},
	},
});
