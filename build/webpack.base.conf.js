var path = require('path')
var config = require('../config')
var webpack = require('webpack')
var version = require('../package.json').version

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const allSource = [resolve('src'), resolve('example'), resolve('test')]

module.exports = {
    entry: {
        nov: './src/index.js'
    },
    output: {
        path: config.build.assetsRoot,
        publicPath: config.build.assetsPublicPath,
        filename: '[name].js',
        chunkFilename: '[name].js',
        library: 'nov',
        libraryTarget: 'umd'
    },
    resolve: {
        extensions: ['.js']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: allSource
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            __VERSION__: JSON.stringify(version)
        })
    ]
}
