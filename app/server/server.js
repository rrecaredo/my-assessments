// BASE SETUP
// =============================================================================

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

mongoose.connect('mongodb://heroku_73wk2frs:l3erf3l3rgohdj5aqn2d9qkjog@ds035006.mlab.com:35006/heroku_73wk2frs');

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();
