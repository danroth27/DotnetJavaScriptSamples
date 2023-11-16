import * as esbuild from 'esbuild'

await esbuild.build({
    entryPoints: ['./src/exampleJsInterop.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    logLevel: 'info',
    target: 'es2022',
    format: 'esm',
    outfile: './dist/exampleJsInterop.js',
});