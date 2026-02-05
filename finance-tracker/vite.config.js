import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Разрешаем хост ngrok для работы самого Vite
    allowedHosts: ["citied-unforward-tennie.ngrok-free.dev"],
    cors: true, // Разрешаем CORS на уровне сервера разработки
  },
});
