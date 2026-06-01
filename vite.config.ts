import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	base: "/eye-rest-timer/",
	server: {
		allowedHosts: ['rr8j8g-5173.csb.app']
	}
});
