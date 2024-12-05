import { defineConfig } from "vite";
import UnoCSS from "unocss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";
import dynamicImport from "vite-plugin-dynamic-import";

// https://vitejs.dev/config/
export default defineConfig({
	worker: {
		format: "es",
	},
	build: {
		target: "esnext",
		rollupOptions: {
			//			treeshake: true,
			input: {
				index: "src/index.tsx",
				optimizer: "src/workers/optimizer.ts",
				//				sw: "src/sw.js",
			},
			output: {
				manualChunks(id) {
					if (id.includes("stateLoader")) {
						return "stateLoader";
					}
				},
			},
		},
	},
	plugins: [
		dynamicImport(),
		react(),
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
			selfDestroying: true,
		}),
		UnoCSS(),
	],
	resolve: {
		alias: {
			"#": path.resolve(__dirname, "./src"),
			"#lib": path.resolve(__dirname, "./src/lib"),
			"#ui": path.resolve(__dirname, "./src/components/ui"),
		},
	},
	server: {
		port: 3000,
		hmr: false,
	},
});
