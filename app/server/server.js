const express          = require('express');
const path             = require('path');
const util             = require('util');
const dotenv           = require('dotenv');
const errorhandler     = require('errorhandler');
const bodyParser       = require('body-parser');
const morgan           = require('morgan');
const cors             = require('cors');
const favicon          = require('serve-favicon');
const cookieParser     = require('cookie-parser');
const passport         = require('passport');
const config           = require('./config');
const expressValidator = require("express-validator");

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
app.use(express.static(path.join(__dirname, '../build/dist')));
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
// Start the server
//----------------------------------------------

app.listen(port, ()=> {
    console.log(`Server started on port ${port} (${process.env.NODE_ENV})`);
});