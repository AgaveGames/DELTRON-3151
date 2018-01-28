const webpack = require('webpack');
const path = require('path');

const PHASER_DIR = path.join(__dirname, './node_modules/phaser/');
const NODE_ENV = process.env.NODE_ENV;
const BUILD_DIR = path.resolve(__dirname, 'dist');

// TODO: move app javascript to src/ or app/
const APP_DIR = path.resolve(__dirname, '');

module.exports = {
    watchOptions: {
        ignored: /node_modules/
    },
    entry: `${APP_DIR}/main.js`,
    output: {
        filename: 'bundle.js',
        path: BUILD_DIR
    },
    resolve: {
        alias: {
            'phaser': path.join(PHASER_DIR, 'build/custom/phaser-split.js'),
            'pixi.js': path.join(PHASER_DIR, 'build/custom/pixi.js'),
            'p2': path.join(PHASER_DIR, 'build/custom/p2.js')
        }
    },
    devtool: 'source-map',
    module: {
        rules: [
            { 
                test: /\.js$/, 
                exclude: /node_modules/, 
                use: 'babel-loader'
            },
            { 
                test: /pixi\.js/, 
                use: 'script-loader' 
            },
            { 
                test: /p2\.js/, 
                use: 'script-loader' 
            },
            { 
                test: /phaser-split\.js$/, 
                use: 'script-loader'
            }
        ]
    },
    plugins: NODE_ENV === 'production' ? [ new webpack.optimize.UglifyJsPlugin() ] : []
};
