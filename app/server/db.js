const mongoose = require('mongoose');
const util     = require('util');

module.exports = (db, debug) => {
    mongoose.connect(db, {}, (err)=> {
        if (err) {
            console.log('Connection Error: ', err);
        } else {
            console.log('Successfully Connected');
        }
    });
    mongoose.connection.on('error', () => {
        throw new Error(`unable to connect to database: ${db}`);
    });

    if (debug) {
        mongoose.set('debug', (collectionName, method, query, doc) => {
            console.log(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
        });
    }
};