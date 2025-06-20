import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  build: {
    target: 'esnext',
    rollupOptions: {
      input: {
        popup: './popup/index.html',
        output: '/options/options.html',
      },
      output: {
        entryFileNames: "assets/[name].js",
      }

    }
  }
})
