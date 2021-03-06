const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = opts => {
    const config = {
        devtool: 'eval-source-map',
        mode: 'development',
        resolve: {
            alias: {
                'webpack-hot-client/client': require.resolve('webpack-hot-client/client')
            },
        },
        serve: {
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
                    loader: 'vue-loader'
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.pug$/,
                    oneOf: [
                        {
                            resourceQuery: /^\?vue/,
                            use: ['pug-plain-loader']
                        },
                        {
                            use: ['raw-loader', 'pug-plain-loader']
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    oneOf: [
                        {
                            resourceQuery: /module/,
                            use: [
                                'vue-style-loader',
                                {
                                    loader: 'css-loader',
                                    options: {
                                        modules: true,
                                        localIdentName: '[local]_[hash:base64:8]'
                                    }
                                }
                            ]
                        },
                        {
                            use: [
                                'vue-style-loader',
                                'css-loader'
                            ]
                        }
                    ]
                }, {
                    test: /\.scss$/,
                    use: [
                        'vue-style-loader',
                        'css-loader',
                        {
                            loader: 'sass-loader',
                            // global data for all components
                            // this can be read from a scss file
                            options: {
                                data: '$color: red;'
                            }
                        }
                    ]
                }
            ]
        },

        plugins: [
            new HtmlWebpackPlugin({
                title: opts.componentName,
                favicon: path.resolve(__dirname, '../../docs/assets/vue.png')
            }),
            new VueLoaderPlugin(),
            new webpack.DefinePlugin({
                COMP: JSON.stringify(opts.componentName),
                LOCA: JSON.stringify(opts.entry),
                PROPS: JSON.stringify(opts.props || [])
            }),
            new webpack.ProvidePlugin({
                Vue: ['vue/dist/vue.esm.js', 'default']
            })
        ]
    }

    return config
}
