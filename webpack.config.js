const path = require('path');

module.exports = {
    entry: './client/index.ts',
    module: {
        rules: [{
            test: /\.ts?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'scripts/bundle.js',
        path: path.resolve(__dirname, 'public')
    }
};