import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";

export default {
  input: "./src/index.tsx",
  output: {
    name: "VaplyPlayer",
    file: "./dist/vaply.js",
    format: "iife",
  },
  plugins: [typescript({ tsconfig: "./tsconfig.build.json" }), postcss({}), nodeResolve(), commonjs()],
};
