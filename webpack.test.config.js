var loaders    = require("./tools/loaders");
var path       = require("path");
var webpack    = require("webpack");

var config = {
    resolve: {
        root: path.resolve(__dirname, "./"),
        extensions: ["",".ts", ".js", ".json"],
        alias: {}
    },
    resolveLoader: {
        modulesDirectories: ["node_modules"]
    },
    devtool: "eval",
    module: {
        loaders: loaders
    },
    plugins : [
        new webpack.optimize.DedupePlugin()
    ]
};

addVendors(config);

module.exports = config;
