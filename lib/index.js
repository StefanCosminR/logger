/**
 * Entry point in module
 */

const Log        = require('./models/Log');
const send       = require('./output');
const config     = require('./config');
const path       = require('path');
const stackTrace = require('./stackTrace');
const formatters = require('./formatters');


/**
 *
 * @param {string} type - one of the error types as described in README.md
 * @param {*} msg - message, it can also be an object
 * @param output - a stream where the log will be written to
 */

function log (type, msg, output) {
    // msg can be also a falsy value (like 0) and we might want to accept that
    if (msg === null || typeof msg === 'undefined') {
        msg = 'Message cannot be undefined or null';
        type = 'error';
    }


    let caller      = stackTrace.getStackTraceParsedData();
    const timestamp = Date.now();

    const fileName  = formatters.formatFileName(caller.filePath);
    msg             = formatters.formatMessage(msg);

    let log = new Log(msg, type, timestamp, caller.functionName, fileName, caller.lineNumber);


    send(output, log);
}



/**
 * Sets all properties in config param to the config file of the module
 * @param {object} options
 */

exports.config = function (options) {
    "use strict";

    if (options) {
        Object.keys(options).forEach(key => {
            config.set(key, options[key]);
        });
    }

};


exports.general = function(...msg) {
    log('general', msg);
};

console.log = exports.general;

