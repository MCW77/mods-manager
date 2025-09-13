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
	},
	define: {
		"process.env.NODE_ENV": JSON.stringify(
			process.env.NODE_ENV || "development",
		),
	},
	optimizeDeps: {
		include: ["unocss"],
		exclude: ["@legendapp/state", "@legendapp/state/react"],
	},
	build: {
		sourcemap: true,
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
      babel: {
        configFile: true // This tells it to use your babel.config.js
      },
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
			"use-sync-external-store/shim/index.js": "react",
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
