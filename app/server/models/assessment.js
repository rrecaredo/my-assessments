const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const assessmentSchema = new Schema({
    name       : String,
    description: String,
    duration   : Number,
    openTime   : Boolean
});

module.exports = mongoose.model('Assessment', assessmentSchema);;