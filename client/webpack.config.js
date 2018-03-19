const webpack = require('webpack');
const path = require('path');
const BundleTracker = require('webpack-bundle-tracker');

const BUILD_DIR = path.resolve(__dirname, '../server/src/oscarbundles/static/oscarbundles/');
const APP_DIR = path.resolve(__dirname, './src/');
const IS_PROD = (process.env.NODE_ENV === 'production');


// Rules
const rules = [
    {
        test: /\.tsx?$/,
        include: APP_DIR,
        loader: 'awesome-typescript-loader',
        enforce: 'pre',
    },
    {
        test: /\.[tj]sx?/,
        include: APP_DIR,
        use: {
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
            },
        },
    },
    {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
    },
    {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
    },
];


// Transformation Plugins
let plugins = [
    new BundleTracker({
        path: BUILD_DIR,
        filename: 'webpack-stats.json'
    }),
    new webpack.DefinePlugin({
        'process.env':{
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }
    }),
];


const config = {
    mode: IS_PROD ? 'production' : 'development',
    devtool: "source-map",
    resolve: {
        modules: ['node_modules'],
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    },
    entry: {
        bundles: path.join(APP_DIR, 'bundles.tsx'),
    },
    output: {
        path: BUILD_DIR,
        filename: '[name].js'
    },
    plugins: plugins,
    module: {
        rules: rules
    },
};

module.exports = config;
