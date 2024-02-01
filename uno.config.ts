import { defineConfig, presetUno, presetIcons, presetTypography } from "unocss";
import presetShadcn from "./src/lib/shadcn/preset.shadcn";

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(),
    presetIcons(),
    presetShadcn(),
  ],
});
