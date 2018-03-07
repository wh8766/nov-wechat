import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

export default [
    {
        input: 'src/index.js',
        output: [
            {
                file: 'lib/index.cjs.js',
                format: 'cjs'
            },
            {
                file: 'lib/index.es.js',
                format: 'es'
            },
            {
                file: 'public/index.js',
                format: 'iife',
                name: 'nov'
            }
        ],
        plugins: [
            resolve(),
            babel({
                exclude: 'node_modules/**' // only transpile our source code
            })
        ],
        watch: {
            include: 'src/**',
            exclude: 'node_modules/**'
        }
    },
    {
        input: 'src/index.js',
        output: [
            {
                file: 'lib/nov.min.js',
                format: 'iife',
                sourcemap: true,
                name: 'nov',
            }
        ],
        plugins: [
            resolve(),
            babel({
                exclude: 'node_modules/**' // only transpile our source code
            }),
            uglify()
        ]
    }
];
