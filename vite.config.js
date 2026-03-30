import { defineConfig } from 'vite';
import { resolve } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    plugins: [
        viteStaticCopy({
            targets: [
                { src: 'manifest.json', dest: '.' },
                { src: 'public/popup.html', dest: '.' },
                { src: 'public/icon*.png', dest: '.' }   // Copy icons manually
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
                // Remove 'src/' from the start to make it flat
                entryFileNames: '[name].js',
            }
        },
        outDir: 'dist',
        emptyOutDir: true
    }
});