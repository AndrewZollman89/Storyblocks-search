import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		globals: true,
		css: false
	}
});
