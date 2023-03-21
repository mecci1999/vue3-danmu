const filesize = require('rollup-plugin-filesize')
const typescript = require('rollup-plugin-typescript2')
const babel = require('@rollup/plugin-babel')
const dts = require('rollup-plugin-dts')
const tscAlias = require('rollup-plugin-tsc-alias')

export default [
  {
    input: './src/index.ts',
    output: [
      {
        dir: './dist',
        format: 'cjs',
        entryFileNames: '[name].js'
      },
      {
        dir: './dist',
        format: 'esm',
        entryFileNames: '[name].esm.js'
      }
    ],
    plugins: [
      babel({ exclude: 'node_modules/**' }),
      typescript({
        tsconfig: './tsconfig.build.json'
      }),
      tscAlias(),
      filesize()
    ]
  },
  {
    input: 'dist/src/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [
      dts.default({
        compilerOptions: {
          emitDeclarationOnly: true,
          resolveJsonModule: true
        }
      })
    ]
  }
]

