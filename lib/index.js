/**
 * Entry point in module
 */

const callerId = require('caller-id');
const Log = require('./models/Log');
const send = require('./output');
const config = require('./config');

/**
 *
 * @param {string} type - one of the error types as described in README.md
 * @param {*} msg - error message, it can also be an object
 * @param output - a stream where the log will be written to
 */

exports.log = function(type, msg, output) {

    if(msg === null || typeof msg === 'undefined') {
        console.error('Message cannot be undefined or null');
        return;
    }

    let caller = callerId.getData();
    const timestamp = Date.now();
    const fileName = caller.filePath.slice(caller.filePath.lastIndexOf('/') + 1);

    let log = new Log(msg, type, timestamp, caller.functionName, fileName, caller.lineNumber);

    send(output, log);

};

/**
 * Sets all properties in config param to the config file of the module
 * @param {object} options
 */

exports.config = function(options) {
    "use strict";

    if(options !== null && typeof options !== 'undefined') {
        Object.keys(options).forEach(key => {
            config.set(key, options[key]);
        });
    }

};