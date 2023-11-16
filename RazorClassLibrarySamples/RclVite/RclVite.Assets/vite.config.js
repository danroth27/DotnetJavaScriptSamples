import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src", 'exampleJsInterop.ts'),
            formats: ['es'],
            fileName: (format, name) => 'exampleJsInterop.js',
        },
    },
})