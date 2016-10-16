const express      = require('express');
const path         = require('path');
const util         = require('util');
const dotenv       = require('dotenv');
const errorhandler = require('errorhandler');
const debug        = require('debug')('my-assessments');
const bodyParser   = require('body-parser');
const mongoose     = require('mongoose');
const permission   = require('permission');
const morgan       = require('morgan');
const cors         = require('cors');
const favicon      = require('serve-favicon');
const cookieParser = require('cookie-parser');
const passport     = require('passport');
const config       = require('./config');
const auth         = require('./auth')();

//----------------------------------------------
// Set up
//----------------------------------------------

const app = express();

// Loads enviroment variables from .env file.
dotenv.load();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());
app.use(express.static(path.join(__dirname, '../build/dist')));
app.use(favicon(__dirname + '../static/favicon.ico'));
app.use(auth.initialize);

const port = process.env.PORT || 8080;

// Error Handling
if (process.env.NODE_ENV === 'dev') {
    app.use(errorhandler())
}

// Database
require('./db')(process.env.DB_CONN, config.debug_db || true);

//----------------------------------------------
// Routers
//----------------------------------------------

app.use('/admin', require('./routes/api'));

//----------------------------------------------
// Start the server
//----------------------------------------------

app.listen(port, ()=> {
    debug(`Server started on port ${port} (${process.env.NODE_ENV})`);
});