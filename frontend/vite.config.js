import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['zustand', 'zustand/vanilla', 'zustand/middleware'],
  },
  server: {
    port: 34115,
    strictPort: true,
    proxy: {
      '/api': { // 匹配以 /api 开头的请求
        target: 'https://uapis.cn', // 目标 API 域名
        changeOrigin: true, // 改变请求头中的 origin 为目标地址
        rewrite: (path) => path.replace(/^\/api/, '/api/v1/misc') // 路径重写
      }
    }
  },
  build: {
    target: 'es2022',
  },
})
