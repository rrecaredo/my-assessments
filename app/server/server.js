const express              = require('express');
const webpack              = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const OpenBrowserPlugin    = require("open-browser-webpack-plugin");
const webpackConfig        = require('../../webpack.config');
const path                 = require('path');
const util                 = require('util');
const dotenv               = require('dotenv');
const errorhandler         = require('errorhandler');
const bodyParser           = require('body-parser');
const morgan               = require('morgan');
const cors                 = require('cors');
const favicon              = require('serve-favicon');
const cookieParser         = require('cookie-parser');
const passport             = require('passport');
const config               = require('./config');
const expressValidator     = require("express-validator");
const yargs                = require('yargs').argv;

//----------------------------------------------
// Set up
//----------------------------------------------

const app = express();

// Loads enviroment variables from .env file.
dotenv.load();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());

app.use(express.static('/'));
app.use(express.static(path.join(__dirname, '../build/dev')));
app.use(favicon(__dirname + '/../static/favicon.ico'));

//----------------------------------------------
// Database
//----------------------------------------------

require('./db')(process.env.DB_CONN, config.debug_db || true);

//----------------------------------------------
// Security
//----------------------------------------------

const auth = require('./auth')();
app.use(auth.initialize());

const port = process.env.PORT || 8080;

// Error Handling
if (process.env.NODE_ENV === 'dev') {
    app.use(errorhandler())
}

//----------------------------------------------
// Routers
//----------------------------------------------

app.use('/admin', require('./routes/api'));
app.use('/users', require('./routes/user'));


//----------------------------------------------
// Webpack Dev Middleware
//----------------------------------------------

if (process.env.NODE_ENV === 'dev' && yargs.hot) {
    webpackConfig.debug = true;
    webpackConfig.watch = true;

    webpackConfig.entry.app.push('webpack-hot-middleware/client?reload=true');

    webpackConfig.output.publicPath = '/';

    const compiler = webpack(webpackConfig);

    app.use(webpackDevMiddleware(compiler, {
        publicPath        : webpackConfig.output.publicPath,
        quiet             : false,
        noInfo            : false,
        hot               : true,
        lazy              : false,
        watchOptions      : {
            aggregateTimeout: 300,
            poll            : 1001
        },
        stats : {
            colors: true
        }
    }));

    app.use(webpackHotMiddleware(compiler, { log: console.log }));
}

//----------------------------------------------
// Start the server
//----------------------------------------------

app.listen(port, ()=> {
    console.log(`Server started on port ${port} (${process.env.NODE_ENV})`);
});