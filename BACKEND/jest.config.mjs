// const { createDefaultPreset } = require("ts-jest");

// const tsJestTransformCfg = createDefaultPreset().transform;

// /** @type {import("jest").Config} **/
// module.exports = {
//   testEnvironment: "node",
//   transform: {
//     ...tsJestTransformCfg,
//   },
//   setupFiles: ["<rootDir>/src/jest.setup.ts"],
//   moduleNameMapper: {
//     "^@/(.*)$": "<rootDir>/src/$1",
//   },
//   moduleDirectories: ["node_modules", "src"],
// };


// jest.config.mjs
import { createDefaultPreset } from "ts-jest";

const { transform } = createDefaultPreset();

/** @type {import('jest').Config} */
export default {
  testEnvironment: "node",
  transform,
  setupFiles: ["<rootDir>/src/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  moduleDirectories: ["node_modules", "src"],
};
