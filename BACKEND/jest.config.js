// jest.config.js
console.log("✅ Usando jest.config.js");

export default {
  testEnvironment: "node",
  // Ya no transformamos TS, solo JS
  setupFilesAfterEnv: ["<rootDir>/src/jest.setup.js"],

  // Alias @/ sigue funcionando para tu src
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  moduleDirectories: ["node_modules", "src"],
};
