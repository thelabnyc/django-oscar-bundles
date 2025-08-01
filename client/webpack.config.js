const webpack = require("webpack");
const path = require("path");
const fs = require("fs");
const BundleTracker = require("webpack-bundle-tracker");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const BUILD_DIR = path.resolve(
    __dirname,
    "../server/oscarbundles/static/oscarbundles/",
);
const APP_DIR = path.resolve(__dirname, "./src/");
const IS_PROD = process.env.NODE_ENV === "production";

// Rules
const rules = [
    {
        test: /\.[tj]sx?$/,
        exclude: [path.resolve(__dirname, "node_modules/core-js/")],
        use: [
            {
                loader: "babel-loader",
                options: Object.assign(
                    {},
                    JSON.parse(fs.readFileSync(".babelrc", "utf8")),
                    {
                        cacheDirectory: true,
                    },
                ),
            },
            {
                loader: "source-map-loader",
            },
            {
                loader: "ts-loader",
                options: {
                    onlyCompileBundledFiles: true,
                },
            },
        ],
    },
    {
        test: /\.scss$/,
        include: APP_DIR,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: "css-loader",
                options: {
                    importLoaders: 2,
                },
            },
            {
                loader: "postcss-loader",
            },
            {
                loader: "sass-loader",
            },
        ],
    },
    {
        test: /\.css$/,
        include: APP_DIR,
        use: [
            MiniCssExtractPlugin.loader,
            {
                loader: "css-loader",
                options: {
                    importLoaders: 1,
                },
            },
            {
                loader: "postcss-loader",
            },
        ],
    },
];

// Transformation Plugins
let plugins = [
    new BundleTracker({
        path: BUILD_DIR,
        filename: "webpack-stats.json",
    }),
    new MiniCssExtractPlugin({
        filename: "[name].css",
        chunkFilename: "[id].css",
    }),
];

const config = {
    mode: IS_PROD ? "production" : "development",
    devtool: "source-map",
    resolve: {
        modules: ["node_modules"],
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    },
    entry: {
        bundles: path.join(APP_DIR, "bundles.tsx"),
    },
    output: {
        path: BUILD_DIR,
        filename: "[name].js",
        clean: true,
    },
    plugins: plugins,
    module: {
        rules: rules,
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all",
                },
            },
        },
    },
};

module.exports = config;
