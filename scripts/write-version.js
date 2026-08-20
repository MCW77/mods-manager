import { readFileSync, writeFileSync } from "fs";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));
writeFileSync(
	"./public/version.json",
	JSON.stringify({ version: pkg.version }),
);
console.log("Wrote version.json:", pkg.version);
