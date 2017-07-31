/**
 *
 * @constructor
 * @param {*} msg - error message, it can also be an object
 * @param {string} type - one of the error types as described in README.md
 * @param {number} timestamp
 * @param {string} functionName
 * @param {string} fileName
 * @param {number} lineNumber
 */

module.exports = function Log(msg, type, timestamp, functionName, fileName, lineNumber) {
    "use strict";

    this.message = msg;
    this.type = type;
    this.timestamp = timestamp;
    this.functionName = functionName;
    this.fileName = fileName;
    this.lineNumber = lineNumber;

};
