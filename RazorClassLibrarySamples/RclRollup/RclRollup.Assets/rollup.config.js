const typescript = require('@rollup/plugin-typescript');

module.exports = {
  input: 'src/exampleJsInterop.ts',
  output: {
    file: 'dist/exampleJsInterop.js',
    format: 'esm'
  },
  plugins: [typescript({
    tsconfig: './tsconfig.json',
    sourceMap: true,
  })]
};