import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";

export default {
  input: "./src/dev/index.ts",
  output: {
    name: "VaplyPlayer",
    dir: "dist",
    format: "iife",
    sourcemap: true,
  },
  plugins: [typescript({ tsconfig: "./tsconfig.build.json" }), postcss({}), nodeResolve(), commonjs()],
};
