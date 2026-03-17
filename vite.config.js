import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    plugins: [
        viteStaticCopy({
            targets: [
                { src: 'manifest.json', dest: '.' }
            ]
        })
    ],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'src/content/main.js'),
                background: resolve(__dirname, 'src/background/background.js'),
            },
            output: {
                entryFileNames: 'src/[name].js',
            }
        },
        outDir: 'dist',
        emptyOutDir: true
    }
});