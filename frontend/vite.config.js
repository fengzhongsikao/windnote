import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 34115,
    strictPort: true,
  },
  build: {
    target: 'es2022',
  },
})
