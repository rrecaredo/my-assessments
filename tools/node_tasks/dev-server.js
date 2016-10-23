var webpack           = require("webpack");
var webpackConfig     = require("../../webpack.config");
var WebpackDevServer  = require("webpack-dev-server");
var OpenBrowserPlugin = require("open-browser-webpack-plugin");
var path              = require("path");

var devConfig = Object.create(webpackConfig);
var host      = "localhost";
var port      = 8081;

devConfig.debug = true;
devConfig.watch = true;

devConfig.plugins.push(new OpenBrowserPlugin({ url: "http://" + host + ":" + port }));

devConfig.entry.app.push("webpack-dev-server/client?http://localhost:8081",
                           "webpack/hot/dev-server");

console.log(process.argv);

new WebpackDevServer(webpack(devConfig), {
    contentBase: path.join(__dirname, "/../../", "app/build/dist"),
    quiet       : false,
    noInfo      : false,
    hot         : true,
    lazy        : false,
    watchOptions: {
        aggregateTimeout : 300,
        poll : 1000
    },
    stats: {
        colors: true
    }
}).listen(port, host, function (err) {
    if (err) {
        console.log(err);
    }
});