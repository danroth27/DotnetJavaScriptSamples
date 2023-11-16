/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
	experiments: {
    outputModule: true,
  },
	context: __dirname,
	entry: {
		main: "./src/exampleJsInterop.ts"
	},
	output: {
		chunkFormat: "module",
		library: {
			name: "app",
			type: "module"
		},
		path: __dirname + "/dist",		
		filename: "exampleJsInterop.js"
	}, 
};
