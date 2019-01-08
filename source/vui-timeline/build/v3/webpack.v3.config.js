const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const postCssUrl = require("postcss-url");
const _output_path = path.resolve(__dirname, '../../', './dist');
const v3platformUtils = require("v3-platform-utils");
const postcssRpx = require("postcss-rpx");
const configUtil = require('v3-pack-cli/src/utils/ConfigUtils');
let v3devCfg = configUtil.getV3DevConfig();
/* 依赖资源的输出文件夹,第三方依赖的js,css文件将被移动到dist下的该文件夹 */
const DepLibFolder = "dependencies";
process.env.NODE_ENV = 'production';
let pluginCode = v3devCfg.pluginCode;
/* 依赖构件资源的绝对路径 */
let libPaths = new Map();
/* 获取已安装的依赖组件的node_modules路径 */
function getDepNodePath() {
  let depLibPath = [];
  let dependencies = v3devCfg.dependencies || [];
  /* 添加间接依赖 */
  dependencies = dependencies.concat(v3devCfg.require || []);
  /* 添加vdk依赖 */
  dependencies.unshift({
    name: 'com.toone.v3.platform-vjs.framework.extension.platform.custom.resource.v3-vdk',
    version: '1.0.0',
    libType: 'dev'
  });
  dependencies.forEach(dep => {
    depLibPath.push(configUtil.getDepNodeDir(dep.name));
  });
  return depLibPath;
}
/**
 * 分析依赖资源
 */
function analyRefResources() {
  /* 获取依赖库资源路径 */
  let depLibPath = getDepNodePath();
  let refInfos = [];
  let _resources = {
    styles: [],
    scripts: [],
    other: []
  };
  var refInfoMaps = {};
  for (let j = 0; j < depLibPath.length; j++) {
    let absPath = depLibPath[j] + path.sep + ".v3devrc";
    /* 获取依赖的配置文件 */
    let pluginV3Cfg = configUtil.getV3CfgByAbs(absPath);
    if (pluginV3Cfg) {
        /* 记录依赖绝对路径 */
      let libdir = path.resolve(depLibPath[j], 'dist', pluginV3Cfg.type);
      if (fs.existsSync(libdir)) {
        libPaths.set(pluginV3Cfg.pluginCode, libdir);
      }
      // 记录安装插件的urlSources
      let urlres = configUtil.getUrlSourcesByCfg(pluginV3Cfg);
      _resources.scripts = _resources.scripts.concat(urlres.js);
      _resources.styles = _resources.styles.concat(urlres.css);
      let symbolicName = pluginV3Cfg.symbolicName;
      let refInfo = {
        symbolicName: symbolicName,
        dependencies: pluginV3Cfg.dependencies,
        libs: [],
        parent: []
      };
      /* 将依赖组件的lib库路径改为基于用户项目的相对路径 */
      for (let i = 0; pluginV3Cfg.libs && (i < pluginV3Cfg.libs.length); i++) {
        let pluginLip = pluginV3Cfg.libs[i];
        let newPrefix = pluginV3Cfg.sources+'/'+pluginV3Cfg.type;
        let oldPrefix = pluginV3Cfg.type+'/';
        let relPath = '';
        if (pluginLip.startsWith(newPrefix)) {
          relPath = pluginLip.replace(newPrefix, '');
        } else if (pluginLip.startsWith(oldPrefix)) {
          relPath = pluginLip.replace(oldPrefix, '');
        }
        if (!relPath.startsWith('/')) {
          relPath = '/'+ relPath;
        }
        refInfo.libs.push(DepLibFolder + '/' + pluginV3Cfg.pluginCode + relPath);
      }
      refInfoMaps[symbolicName] = refInfo;
    } //if
  } //for
  // 添加本项目的urlsources配置
  let pluginUrlsources = configUtil.getUrlSourcesByCfg(v3devCfg);
  _resources.scripts = _resources.scripts.concat(pluginUrlsources.js);
  _resources.styles = _resources.styles.concat(pluginUrlsources.css);
  for (var symbolicName in refInfoMaps) {
    var refInfo = refInfoMaps[symbolicName];
    var dependencies = refInfo.dependencies;
    var symbolicName = refInfo.symbolicName;
    if (dependencies && dependencies.length > 0) {
      for (var i = 0, len = dependencies.length; i < len; i++) {
        var depen = dependencies[i];
        if (refInfoMaps[depen]) {
          refInfo.parent.push(refInfoMaps[depen]);
        }
      }
    }
    refInfos.push(refInfo);
  }
  var addedNames = [];
  var addPath = function (refInfo) {
    if (refInfo.parent.length > 0) {
      for (var i = 0, l = refInfo.parent.length; i < l; i++) {
        var parentInfo = refInfo.parent[i];
        addPath(parentInfo);
      }
    }
    if (addedNames.indexOf(refInfo.symbolicName) == -1) {
       // 添加libs本地资源
      let libs = refInfo.libs;
      let excludeReg = /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf)(\?\S*)?$/;
      if (libs && libs.length > 0) {
        for (var j = 0, l = libs.length; j < l; j++) {
          var suffix = libs[j].substring(libs[j].lastIndexOf("."));
          if (suffix === ".css" || suffix === ".less") {
            _resources.styles.push(libs[j]);
          } else if (suffix === ".js") {
            _resources.scripts.push(libs[j]);
          } else if(!excludeReg.test(suffix)){
            _resources.other.push(libs[j]);
          }
        }
      }
      addedNames.push(refInfo.symbolicName);
    }
  }
  for (var i = 0, len = refInfos.length; i < len; i++) {
    var refInfo = refInfos[i];
    addPath(refInfo);
  }
  var nowPluginPath = path.resolve(fs.realpathSync("."), ".v3devrc");
  if (fs.existsSync(nowPluginPath)) {
    var v3devrcFile = fs.readFileSync(nowPluginPath);
    if (v3devrcFile) {
      v3devrcFile = JSON.parse(v3devrcFile.toString());
      var scope = v3devrcFile.scope;
      var win_type = "web";
      if ("mobile" == scope) {
        win_type = "mobile";
      }
      var res = v3platformUtils.TemplateUtils.getRelativeResourcePath(win_type, _output_path);
      if (res) {
        /**依赖资源必须放在平台资源后面加载 */
        _resources.scripts = res.scripts.concat(_resources.scripts);
        _resources.styles = res.styles.concat(_resources.styles);
      }
    }
  }
  return _resources;
}
let _analyResources = analyRefResources();
//需要拷贝的任务列表
let copyList = [{
  from: path.join(__dirname, '../../', './node_modules/v3-pack-cli/src/vendor/vplatform/assets'),
  to: path.join(__dirname, '../../', 'dist/vendor/vplatform/assets')
}];
/* 遍历要拷贝的依赖库列表 */
libPaths.forEach((respath, pluginCode) => {
    copyList.push({
        from: respath,
        to: path.join(__dirname, '../../', 'dist', DepLibFolder,pluginCode),
        ignore: ['*.map']
    });
});
/* 输出资源的路径前缀,使用插件名作为项目资源打包后的文件名 */
let resOutPrefix = "widget/" + pluginCode;
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
let vPlatformPath = path.resolve(__dirname, '../../', './node_modules/v3-platform-utils/src/vplatform');
module.exports = {
  entry: {
    "widget/vui-timeline": './index.js'
  },
  output: {
    path: _output_path,
    filename: resOutPrefix + '.js',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  externals: getExternals(),
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@vPlatform': vPlatformPath,
      '@vPlatformWebSkinVar' : path.resolve(vPlatformPath,'skin/web/var.less'),
      '@vPlatformBaseSkinVar' : path.resolve(vPlatformPath,'skin/base.less'),
      '@vPlatformMobileSkinVar' : path.resolve(vPlatformPath,'skin/mobile/var.less')
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
        name: 'widget/[sha512:hash:base64:7].[ext]',
        publicPath: function (url) {
          var queryStr = this.resourceQuery;
          if (queryStr && this.resourceQuery.indexOf("cssRes=true") != -1) {
            var array = url.split("/");
            return "./" + array.pop();
          } else {
            return {
              executable: true,
              script: `(function(){
                var v3vdk = require('v3-vdk');
                if(v3vdk && 'undefined' != typeof v3vdk.res){
                  return v3vdk.res.getWidgetResPath("${v3devCfg.pluginCode}","${v3devCfg.type}","${url}");
                }else if(v3vdk && 'undefined' != typeof v3vdk.default.res){
                  return v3vdk.default.res.getWidgetResPath("${v3devCfg.pluginCode}","${v3devCfg.type}","${url}");
                }else{
                  return "${url}";
                }
              })()`
            };
          }
        }
      }
    }]
  },
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new CopyWebpackPlugin(copyList),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      title: 'vui-timeline测试页面',
      resources: _analyResources,
      template: path.join(__dirname, '../../', '/examples/index' + ('mobile' == 'all' ? '_mobile' : '') + '.html')
    }),
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
  //module.exports.devtool = '#source-map';
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