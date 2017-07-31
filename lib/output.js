const config = require('./config');

/**
 * Function that writes an object to a stream
 * @param output - a stream where the log will be written to or undefined to be printed on stdout
 * @param {object} log
 */
module.exports = function (output, log) {
    "use strict";

    if (config.has('output')) {
        output = config.get('output');
    }

    if (output === null || typeof output === 'undefined') {
        console.log(log);
        return;
    }

    try {
        output.write(JSON.stringify(log));
        output.end();
    } catch (err) {
        console.error('You need to provide and output stream or leave it undefined');
    }


};