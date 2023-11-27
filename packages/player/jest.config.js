const commonOptions = {
  transform: {
    "^.+.tsx?$": [
      "ts-jest",
      {
        // external TS config
        tsconfig: "./tsconfig.test.json",
      },
    ],
  },
  moduleNameMapper: {
    // module aliases
    "^@player/(.*)$": "<rootDir>/src/$1",
    // stub non-js files
    "^.+\\.(sass|less|css)$": "<rootDir>/src/__mocks__/styles.js",
    // force CJS modules (defaults to ESM with which jest cannot work)
    "^@testing-library/preact(/(.*)|$)": "<rootDir>/node_modules/@testing-library/preact/dist/cjs$1",
    "^preact(/(.*)|$)": "<rootDir>/node_modules/preact$1",
  },
};

/** @returns {Promise<import('ts-jest').JestConfigWithTsJest>} */
module.exports = () => {
  return {
    verbose: true,
    projects: [
      // --- unit tests
      {
        ...commonOptions,

        displayName: "unit",
        roots: ["<rootDir>/src"],
        // preset that converts everything to CJS syntax so jest can work with it
        preset: "ts-jest/presets/js-with-ts",
        testEnvironment: "jest-environment-jsdom",
        setupFilesAfterEnv: ["<rootDir>/src/__mocks__/setupTests.ts"],
      },
    ],
  };
};
