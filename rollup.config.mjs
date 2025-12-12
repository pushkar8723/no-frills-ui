import swc from '@rollup/plugin-swc';
import terser from '@rollup/plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import pkg from './package.json' with { type: 'json' };

const isProduction = process.env.NODE_ENV === 'production';

export default {
    input: './src/components/index.ts',
    output: [
        {
            file: pkg.main,
            format: 'cjs',
            exports: 'named',
            sourcemap: true,
        },
        {
            dir: 'lib-esm',
            format: 'esm',
            preserveModules: true,
            preserveModulesRoot: 'src',
        },
    ],
    external: ['react', 'react-dom', 'prop-types', '@emotion/styled', '@emotion/react'],
    plugins: [
        external(),
        resolve({
            extensions: ['.ts', '.tsx', '.js', '.jsx'],
        }),
        swc({
            swc: {
                jsc: {
                    parser: {
                        syntax: 'typescript',
                        tsx: true,
                    },
                    transform: {
                        react: {
                            runtime: 'automatic',
                            importSource: '@emotion/react',
                        },
                    },
                    experimental: {
                        plugins: [['@swc/plugin-emotion', {}]],
                    },
                },
            },
        }),
        commonjs({
            include: ['node_modules/**'],
        }),
        isProduction &&
            terser({
                compress: {
                    drop_console: false,
                    ecma: 2020,
                },
                format: {
                    comments: false,
                },
                mangle: {
                    reserved: [],
                },
            }),
    ].filter(Boolean),
};
