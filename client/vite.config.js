import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({ 
  // server: {
  //   proxy: {
  //     "/api": "http://localhost:8080",
  //   }  
  // } ,
  build: {
    outDir: 'dist' // Ensure this matches your expected output directory
  },
  plugins: [react()],
})