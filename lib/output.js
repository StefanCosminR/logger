const config = require('./config');

/**
 * Function that writes an object to a stream
 * @param output - a stream where the log will be written to or undefined to be printed on stdout
 * @param {object} log
 */
module.exports = function (output, log) {
    "use strict";

    if(!output) {
        output = config.has('output') ? config.get('output') : process.stdout;
    }

    try {
        output.write(JSON.stringify(log));
        output.flush();
    } catch (err) {
        console.error('You need to provide and output stream or leave it undefined');
    }

};