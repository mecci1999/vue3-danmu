const filesize = require("rollup-plugin-filesize");
const typescript = require("rollup-plugin-typescript2");
const dts = require("rollup-plugin-dts");
const tscAlias = require("rollup-plugin-tsc-alias");

module.exports = [
  {
    input: "./src/index.ts",
    output: [
      {
        dir: "./dist",
        format: "cjs",
        entryFileNames: "[name].js",
      },
      {
        dir: "./dist",
        format: "esm",
        entryFileNames: "[name].esm.js",
      },
    ],
    plugins: [
      typescript({
        tsconfig: "./tsconfig.build.json",
      }),
      tscAlias(),
      filesize(),
    ],
  },
  {
    input: "dist/src/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [
      dts.default({
        compilerOptions: {
          emitDeclarationOnly: true,
          resolveJsonModule: true,
        },
      }),
    ],
  },
];
