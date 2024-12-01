import typescript from 'rollup-plugin-typescript2';
import commonjs from 'rollup-plugin-commonjs';
import external from 'rollup-plugin-peer-deps-external';
import resolve from 'rollup-plugin-node-resolve';

import pkg from './package.json' assert { type: "json" };

export default {
  input: './src/components/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      exports: 'named',
      sourcemap: true
    },
  ],
  external: ['react', 'react-dom', 'prop-types', '@emotion/styled'],
  plugins: [
    external(),
    resolve(),
    typescript({
      rollupCommonJSResolveHack: true,
      clean: true,
      tsconfigOverride: {
        compilerOptions: {
            declaration: false
        }
      },
    }),
    commonjs({
      include: ['node_modules/**']
    })
  ],
}