import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["**/*.{test,spec}.{js,mjs,ts,tsx}"],
        exclude: [
            "**/node_modules/**",
            "**/dist/**",
            "**/build/**",
            "**/coverage/**",
            "**/index.ts",
            "**/.*",
            "**/I.*"
        ],
        coverage: {
            reporter: ["text", "lcov"],
            include: ["src/**/*.ts"], // Only include files that are imported by tests
            exclude: ["**/*.test.ts", "**/__tests__/**"],
            all: false // Only instrument files that are actually tested
        }
    }
});
