const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const BundleTracker = require('webpack-bundle-tracker');
const DuplicatePackageCheckerPlugin = require("duplicate-package-checker-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const BUILD_DIR = path.resolve(__dirname, '../server/src/oscarbundles/static/oscarbundles/');
const APP_DIR = path.resolve(__dirname, './src/');
const IS_PROD = (process.env.NODE_ENV === 'production');


// Rules
const rules = [
    // Compile Typescript
    {
        test: /\.[tj]sx?$/,
        include: APP_DIR,
        loader: 'awesome-typescript-loader',
        enforce: 'pre',
    },
    // Load source maps output by typescript
    {
        test: /\.[tj]sx?/,
        use: ["source-map-loader"],
        enforce: "pre",
    },
    // Run Babel on non-Typescript JS
    {
        test: /\.js$/,
        include: path.resolve(__dirname, 'node_modules/'),
        exclude: path.resolve(__dirname, 'node_modules/core-js/'),
        use: {
            loader: 'babel-loader',
            options: Object.assign({}, JSON.parse(fs.readFileSync('.babelrc', 'utf8')), {
                cacheDirectory: true,
            }),
        },
    },
    // Sass
    {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
    },
    // CSS
    {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
    },
];


// Transformation Plugins
let plugins = [
    new BundleTracker({
        path: BUILD_DIR,
        filename: 'webpack-stats.json'
    }),
    new DuplicatePackageCheckerPlugin({
        verbose: true,
        strict: true,
    }),
    new webpack.DefinePlugin({
        'process.env':{
            'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }
    }),
    new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'webpack-bundle-analyzer.html',
        defaultSizes: 'gzip',
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
