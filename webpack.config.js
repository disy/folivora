const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: ['./client/index.ts', './styles/index.scss'],
    module: {
        rules: [{
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }, {
            test: /\.scss$/,
            use: [
               MiniCssExtractPlugin.loader, {
                  loader: 'css-loader',
                  options: {
                     url: false
                  }
               },
               'sass-loader'
            ]
         }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'scripts/bundle.js',
        path: path.resolve(__dirname, 'public')
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'styles/bundle.css',
         })
    ]
};