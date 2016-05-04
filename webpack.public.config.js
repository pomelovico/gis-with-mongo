/**
 * Created by LikoLu on 2016/3/29.
 */
var webpack = require('webpack');
var path = require('path');
module.exports = {
    entry: {
        bundle:'./src/index.js'
    },
    externals:{
        angular: true,
        ol: true
    },
    output: {
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
    plugins: [
        new webpack.NoErrorsPlugin()
    ]
};