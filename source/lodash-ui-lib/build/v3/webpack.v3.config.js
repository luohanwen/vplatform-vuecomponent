const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const postCssUrl = require("postcss-url");
const _output_path = path.resolve(__dirname, '../../', './dist');
const postcssRpx = require("postcss-rpx");
const configUtil = require('v3-pack-cli/src/utils/ConfigUtils');
const fs = require('fs');
let v3devCfg = configUtil.getV3DevConfig();
let pluginCode = v3devCfg.pluginCode;
/* 输出资源的路径前缀,使用插件名作为项目资源打包后的文件名 */
let resOutPrefix = "resource/" + pluginCode;
process.env.NODE_ENV = 'production';
let vPlatformPath = path.resolve(__dirname, '../../', './node_modules/v3-platform-utils/src/vplatform');
/* 获取全部外部资源库 */
function getExternals() {
    let externals = {
        "vue": "Vue",
        "jQuery": "jQuery",
        "jquery": "jquery"
    };
    let modulePath = path.resolve(__dirname, '../../node_modules');
    if (fs.existsSync(modulePath)) {
        let fileNames = fs.readdirSync(modulePath);
        if (fileNames && fileNames.length > 0) {
            fileNames.forEach(fileName => {
                let absPath = path.resolve(modulePath, fileName, '.v3devrc');
                if (fs.existsSync(absPath)) {
                    let v3cfgContent = fs.readFileSync(absPath);
                    let v3devrc = JSON.parse(v3cfgContent);
                    if(v3devrc.resourceCode){
                        externals[v3devrc.pluginCode] = v3devrc.resourceCode;
                    }
                }
            });
        }
    }
    return externals;
}
module.exports = {
    entry: {
        "resource/lodash-ui-lib": './index.js'
    },
    output: {
        path: _output_path,
        filename: resOutPrefix + '.js',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        library: 'vPlatform-resource-01aa9e087821c35fcaafd7ef39c9b475'
    },
    externals:getExternals(),
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@vPlatform': vPlatformPath,
            '@vPlatformWebSkinVar' : path.resolve(vPlatformPath,'skin/web/var.less'),
            '@vPlatformBaseSkinVar' : path.resolve(vPlatformPath,'skin/base.less'),
            '@vPlatformMobileSkinVar' : path.resolve(vPlatformPath,'skin/mobile/var.less'),
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "vue-style-loader",
                use: [
                    "css-loader",
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                require('autoprefixer')(),
                                postCssUrl({
                                    url: function (asset) {
                                        var res = asset.url;
                                        if (res) {
                                            res = res.trim();
                                            var prefix = res.indexOf("?") != -1 ? '&' : '?';
                                            res = res + prefix + "cssRes=true";
                                        }
                                        return res;
                                    }
                                }),
                                postcssRpx()
                            ]
                        }
                    }
                ]
            })
        }, {
            test: /\.less$/,
            loader: 'style-loader!css-loader!less-loader',
            options: {
                plugins: [
                    require('autoprefixer')(),
                    postCssUrl({
                        url: function (asset) {
                            var res = asset.url;
                            if (res) {
                                res = res.trim();
                                var prefix = res.indexOf("?") != -1 ? '&' : '?';
                                res = res + prefix + "cssRes=true";
                            }
                            return res;
                        }
                    }),
                    postcssRpx()
                ]
            }
        }, {
            test: /\.vue$/,
            loader: 'vue-loader',
            options: {
                loaders: {
                    css: ExtractTextPlugin.extract({
                        use: 'css-loader',
                        fallback: 'vue-style-loader'
                    }),
                    less: ExtractTextPlugin.extract({
                        use: 'css-loader!less-loader',
                        fallback: 'vue-style-loader'
                    })
                },
                postLoaders: {
                    html: 'babel-loader'
                },
                postcss: {
                    plugins: [
                        require('autoprefixer')(),
                        postCssUrl({
                            url: function (asset) {
                                var res = asset.url;
                                if (res) {
                                    res = res.trim();
                                    var prefix = res.indexOf("?") != -1 ? '&' : '?';
                                    res = res + prefix + "cssRes=true";
                                }
                                return res;
                            }
                        }),
                        postcssRpx()
                    ]
                }
            }
        }, {
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/
        }, {
            test: /\.ejs$/,
            loader: 'ejs-loader'
        }, {
            test: /^.(?!.*(css|vue|js|ejs|less|sass|html|htm|json)(\?\S*)?$)/,
            loader: 'v3-file-loader',
            options: {
                name: 'resource/[sha512:hash:base64:7].[ext]',
                publicPath: function (url) {
                    var queryStr = this.resourceQuery;
                    if (queryStr && this.resourceQuery.indexOf("cssRes=true") != -1) {
                        var array = url.split("/");
                        return "./" + array.pop();
                    } else {
                        return url;
                    }
                }
            }
        }]
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin(),
        new ExtractTextPlugin({
            filename: resOutPrefix + ".css"
        })
    ],
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        overlay: true,
        open: true,
        inline: true,
        host: "localhost",
        port: 9090,
        contentBase: "./dist/",
        clientLogLevel: "error"
    },
    performance: {
        hints: false
    }
};
if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ]);
} else {
    module.exports.devtool = '#eval-source-map';
}