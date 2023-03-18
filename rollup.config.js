import pkg from "./package.json";
import json from "rollup-plugin-json";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { babel } from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";
import filesize from "rollup-plugin-filesize";

const formatName = "simple-barrage";

export default {
  input: "./src/index.js",
  output: [
    {
      file: pkg.main,
      format: "cjs",
    },
    {
      file: pkg.module,
      format: "esm",
    },
    {
      file: pkg.browser,
      format: "umd",
      name: formatName,
    },
  ],
  plugins: [
    json(),
    commonjs({
      include: /node_modules/,
    }),
    resolve({ preferBuiltins: true, jsnext: true, main: true, browser: true }),
    babel({ exclude: "node_modules/**" }),
    terser(),
    filesize(),
  ],
};
