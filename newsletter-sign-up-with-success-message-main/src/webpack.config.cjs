const path = require('path');

module.exports = {
    entry: './ts/index.ts',
    module: {
        rules: [
            {
                use: 'ts-loader',
            },
        ],
    },
    resolve: {
        extensions: ['.ts'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    mode: "production"
};