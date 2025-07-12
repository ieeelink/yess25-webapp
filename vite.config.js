import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    host: true,
    port: 3000,
    allowedHosts: [
      '02f8577a3284.ngrok-free.app',
      'localhost'
    ]
  },
  preview: {
    host: true,
    port: 3001,
    allowedHosts: [
      'v8fqt2tbhu.ap-south-1.awsapprunner.com',
      'localhost'
    ]
  }
})
