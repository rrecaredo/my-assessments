// BASE SETUP
// =============================================================================

var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

mongoose.connect(require('/cconfig'));

var router = express.Router();
