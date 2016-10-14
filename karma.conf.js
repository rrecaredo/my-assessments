var webpackConfig = require('./webpack.test.config');
var isRelease     = (process.env.NODE_ENV === 'production');
var argv          = require('yargs').argv;
var preprocessors = {};

preprocessors['app/client/spec.bundle.ts'] = ['webpack', 'sourcemap'];
preprocessors['app/client/**/*.js']        = ['webpack', 'sourcemap', 'coverage'];
preprocessors['app/client/**/*.ts']        = ['webpack', 'sourcemap', 'coverage'];

function karmaConfig(config) {
    º
    config.set({

        files : [
            'node_modules/angular.js',
            'node_modules/angular-ui-router.js',
            'node_modules/dist/angular-toastr.tpls.js',
            'node_modules/angular-mocks.js',
            'node_modules/angular-cookies.js',
            'node_modules/moment.js',
            'node_modules/lodash.js',
            'tests/spec.bundle.ts'
        ],
        coverageReporter  : {
            dir : 'app/build/tests-result/',
            reporters: [
                {type: 'html', subdir: 'coverage'},
                {type: 'json', subdir: './', file: 'code-coverage.json'},
                {type: 'text'}
            ]
        },
        jsonResultReporter: {
            outputFile: 'karma-result.json'
        },

        basePath     : '',
        frameworks   : ['jasmine', 'sinon'],
        webpack      : webpackConfig,
        exclude      : [],
        reporters    : [],
        preprocessors: preprocessors,
        port         : 9876,
        colors       : true,
        logLevel     : config.LOG_INFO,
        browsers     : ['PhantomJS'],
        concurrency  : Infinity,
        autoWatch    : true,
        singleRun    : false,

        plugins: [
            'karma-webpack',
            'karma-jasmine',
            'karma-sinon',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher',
            'karma-coverage',
            'karma-sourcemap-loader',
            'karma-json-result-reporter',
            'karma-jasmine-html-reporter',
            'karma-mocha-reporter']
    });

    if ((isRelease || argv.reports) && argv.browsers === 'PhantomJS') {
        config.set({
            autoWatch: false,
            singleRun: true
        });
    }

    if (argv.reports) {
        webpackConfig.module['postLoaders'] = [
            {
                test   : /(\.ts|\.js)$/,
                exclude: /(tests|node_modules)/,
                loader : 'istanbul-instrumenter'
            }
        ];

        config.set({reporters: ['progress', 'coverage', 'json-result']});
    }
    else {
        config.set({reporters: ['mocha', 'kjhtml']});
    }
}

module.exports = karmaConfig;
