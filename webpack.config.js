var webpack               = require('webpack');
var loaders               = require("./tools/webpack/loaders");
var path                  = require('path');
var autoprefixer          = require('autoprefixer');
var isRelease             = (process.env.NODE_ENV === 'production');
var htmlWebpackPlugin     = require('html-webpack-plugin');
var WebpackNotifierPlugin = require('webpack-notifier');
var ExtractTextPlugin     = require('extract-text-webpack-plugin');

var config = {
    entry: {
        app: ['./app/client/app.bootstrapper'],
        vendor : ['angular', 'angular-ui-router', 'angular-animate', 'angular-toastr', 'angular-cookies',
                  'angular-aria', 'angular-material', 'angular-storage', 'angular-material-icons',
                  'moment', 'lodash', 'angular-moment-picker', 'angular-file-upload', 'angular-cookies',
                  'redux', 'ng-redux', 'redux-ui-router', 'redux-logger', 'redux-thunk', 'ng-redux-dev-tools']
    },
    output: {
        filename : 'build.js',
        path     : path.join(__dirname, 'app/build/dev'),
    },
    resolve: {
        root       : path.resolve(__dirname, './..'),
        extensions : ['', '.ts', '.js', '.json'],
        alias: {
            'ng-redux-dev-tools' : path.join(__dirname,'app/client/assets/scripts/ng-redux-dev-tools.js')
        }
    },
    resolveLoader: {
        modulesDirectories: ['node_modules']
    },
    devtool: 'inline-source-map',
    stats: { children: false, warnings : false },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js'),
        new htmlWebpackPlugin({
            template : './app/client/master.html',
            inject   : 'body',
            hash     : true
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new ExtractTextPlugin('[name].css')
    ],
    module: {
        noParse : [/moment/],
        loaders : loaders,
        postcss : function () {
            return [autoprefixer];
        }
    }
};

 if (isRelease) {
     config.output.path = path.join(__dirname, 'app/build/dist');
     delete config.devtool;
     config.plugins.push(new webpack.optimize.UglifyJsPlugin({ minimize: true, mangle: true, compress: { warnings: false } }));
 }
 else {
     //config.plugins.push(new WebpackNotifierPlugin()); // King of annoying
 }

 module.exports = config;