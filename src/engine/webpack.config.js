const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

function entry (componentName, fileImport) {
    return `
        document.querySelector('body').innerHTML = '<div id="app"><${componentName} /></div>'

        import Test from '${fileImport}'
        import Vue from 'vue/dist/vue.js'
    `
}

module.exports = opts => {

    const config = {
        devtool: 'eval-source-map',
        devServer: {
            contentBase: opts.cwd,
            compress: true,
            open: true,
            port: 9000,
            disableHostCheck: true
        },
        entry: () => entry(opts.componentName, opts.entry), // './test/demo/entry.js',

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
            new HtmlWebpackPlugin()
        ]
    }

    return config
}
