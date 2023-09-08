const path = require('path');

module.exports = {
    entry: './ts/index.ts',
    module: {
        rules: [
            {
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: 'tsconfig-build.json'
                    }
                }]
            },
        ],
    },
    resolve: {
        extensions: ['.ts'],
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'out/dist'),
    },
    mode: "production"
};