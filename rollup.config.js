import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';
import config from './package.json'

const input = 'src/index.js'
const banner = `//@copyright Lenovo service wechat jssdk, version: ${config.version}`

export default [
    {
        input,
        output: [
            {
                banner,
                file: 'lib/index.cjs.js',
                format: 'cjs'
            },
            {
                banner,
                file: 'lib/index.es.js',
                format: 'es'
            },
            {
                banner,
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
        input,
        output: [
            {
                banner,
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
            uglify({
                output: {
                    comments: function(node, comment) {
                        if (comment.type === "comment1") {
                            return /@copyright/i.test(comment.value);
                        }
                    }
                }
            })
        ]
    }
];
