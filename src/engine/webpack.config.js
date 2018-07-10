const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = opts => {
    console.log(opts)

    const config = {
        devtool: 'eval-source-map',
        mode: 'development',
        devServer: {
            contentBase: opts.cwd,
            compress: true,
            open: true,
            port: 9000,
            disableHostCheck: true
        },
        entry: path.resolve(__dirname, '../entry/index.js'),

        module: {
            rules: [
                {
                    test: /\.vue$/,
                    loader: 'vue-loader',
                    options: {
                        loaders: {
                            js: {
                                loader: 'babel-loader'
                            }, 
                            scss: 'vue-style-loader!css-loader!sass-loader',
                            sass: 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                            less: 'vue-style-loader!css-loader!less-loader'
                        }
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                }
            ]
        },

        plugins: [
            new HtmlWebpackPlugin(),
            new VueLoaderPlugin(),
            new webpack.DefinePlugin({
                COMP: JSON.stringify(opts.componentName),
                LOCA: JSON.stringify(opts.entry)
            })
        ]
    }

    return config
}
