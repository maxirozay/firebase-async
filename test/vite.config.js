import { defineConfig } from 'vite'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    visualizer({
      template: 'treemap',
      open: true,
      gzipSize: true,
      filename: 'bundle.html'
    })
  ],
  esbuild: {
    legalComments: 'none'
  }
})
