import { defineConfig, presetUno, presetIcons } from "unocss";
import presetAttributify from "@unocss/preset-attributify";
import transformerAttributifyJsx from "@unocss/transformer-attributify-jsx";

export default defineConfig({
	presets: [presetUno(), presetAttributify(), presetIcons()],
	transformers: [transformerAttributifyJsx()],
});
