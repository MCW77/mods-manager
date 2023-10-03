import { defineConfig, presetUno, presetIcons } from "unocss";
import presetShadcn from "./src/lib/shadcn/preset.shadcn";

export default defineConfig({
	presets: [presetUno(), presetIcons(), presetShadcn()],
});
