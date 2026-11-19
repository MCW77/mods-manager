import { readFileSync, writeFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));
writeFileSync(
  "./public/version.json",
  JSON.stringify({ version: pkg.version }).replace("{", "{ ").replace("}", " }").replace(":", ": "),
);
writeFileSync("./.env", `VITE_VERSION=${pkg.version}`);
