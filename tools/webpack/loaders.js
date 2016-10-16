var isRelease  = (process.env.NODE_ENV === 'production');
var path       = require("path");

var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = [
    {
        test: /\.css$/,
        loader: (isRelease)
                ? ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
                : "style-loader!css-loader!postcss-loader",
        include : [ path.resolve(__dirname, "../../app/client") ],
    },
    {
        test    : /\.scss$/,
        include : [ path.resolve(__dirname, "../../app/client") ],
        loader: (isRelease)
                ? ExtractTextPlugin.extract("style-loader", "css-loader?sourceMap!postcss-loader?sourceMap!sass-loader?sourceMap")
                : "style-loader!css-loader?sourceMap!postcss-loader?sourceMap!sass-loader?sourceMap"
    },
    {
        test: /\.ts$/,
        loader: "ng-annotate!ts",
        include: [ path.resolve(__dirname, "../../app/client") ]
    },
    {
        test    : /\.js(x?)$/,
        include: [ path.resolve(__dirname, "../../app/client") ],
        loaders: ["ng-annotate"]
    },
    {
        test    : /\.html$/,
        loader  : "raw",
        include: [ path.resolve(__dirname, "../../app/client/master.html") ]
    },
    {
        test: /\.html$/,
        loader: "ngtemplate!html",
        exclude: [ path.resolve(__dirname, "../../app/client/master.html") ]
    },
    {
        test    : /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: [ path.resolve(__dirname, "../../app/client/assets") ],
        loader  : "url-loader?limit=10000&mimetype=application/font-woff"
    },
    {
        test    : /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: [ path.resolve(__dirname, "../../app/client/assets") ],
        loader  : "file-loader"
    },
    {
        test: /\.(jpe?g|png|gif)$/i,
        loader: "file?name=img/[name].[ext]"
    }
];
