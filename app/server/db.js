const mongoose = require('mongoose');
const util     = require('util');

module.exports = (db, debug) => {
    mongoose.connect(db, {}, (err)=> {
        if (err) {
            debug('Connection Error: ', err);
        } else {
            debug('Successfully Connected');
        }
    });
    mongoose.connection.on('error', () => {
        throw new Error(`unable to connect to database: ${db}`);
    });

    if (debug) {
        mongoose.set('debug', (collectionName, method, query, doc) => {
            debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
        });
    }
};