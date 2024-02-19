import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    visualizer({
      template: "treemap", // or sunburst
      open: true,
      gzipSize: true,
      filename: "analice.html"
    })
  ]
})
