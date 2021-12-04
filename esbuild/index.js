/* eslint-disable @typescript-eslint/no-var-requires */
const esbuild = require("esbuild");
const path = require("path");

esbuild.build({
  entryPoints: [path.join(__dirname, "..", "src/index.ts")],
  tsconfig: path.join(__dirname, "..", "tsconfig.json"),
  write: true,
  bundle: true,
  outfile: path.join(__dirname, "..", "dist/main.js"),
  target: "es6",
  platform: "node",
  format: "cjs",
  external: [],
});
