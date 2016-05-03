/**
 * Created by LikoLu on 2016/3/29.
 */
var webpack = require('webpack');
var path = require('path');
module.exports = {
/*    entry: [
        'webpack-dev-server/client?http://localhost:3004', // WebpackDevServer host and port
        'webpack/hot/dev-server',
        './src/index.js'
    ],*/
    devtool:"source-map",
    entry: {
        bundle:'./src/index.js'
    },
    externals:{
        angular: true
    },
    output: {
        // publicPath:'/public/',
        path: __dirname+'/script',
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['', '.js','jsx']
    },
    module: {
        loaders:[
            {
                test: [/\.js$/, /\.jsx$/],
                exclude: /node_modules/,
                loader: 'babel'
            },
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test:/\.html$/,
                loader:'html-loader'
            }

        ]
    },
    devServer: {
        historyApiFallback: true,
        hot: true,
        inline: true,
        progress: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // new webpack.optimize.CommonsChunkPlugin('vendor','vendor.js'),
        new webpack.NoErrorsPlugin()
    ]
};