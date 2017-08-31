/**
 * Entry point in module
 */

const Log = require('./models/Log');
const send = require('./output');
const config = require('./config');
const path = require('path');
const stackTrace = require('./stackTrace');
const childForker = require('child_process');


/**
 *
 * @param {string} type - one of the error types as described in README.md
 * @param {*} msg - error message, it can also be an object
 * @param output - a stream where the log will be written to
 */

function log (type, msg, output) {


    if (msg === null || typeof msg === 'undefined') {
        msg = 'Message cannot be undefined or null';
        type = 'error';
    }

    type = type ? type : 'general';

    let caller = stackTrace.getStackTraceParsedData();
    const timestamp = Date.now();
    var fileName = "SWARM";

    if(caller.filePath){
        try{
            fileName = path.basename(caller.filePath);
        }catch(e){
            console.error(e);
            console.info(caller);
        }
    }else{
        try{
            //throw(new Error("bau"));
            // console.info("META----------------", thisAdapter);
            // console.info('META-------------------', this);
        }catch(e){
            console.info(e);
        }
    }



    var logmsg = msg;
    if(Array.isArray(msg)){
        logmsg = "";
        for(var i=0; i<msg.length; i++){
            logmsg += msg[i]+" ";
        }
    }

    let log = new Log(logmsg, type, timestamp, caller.functionName, fileName, caller.lineNumber);

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
    /**
     * don't concatenate them, insert them as different messages
     */
    log('general', msg);
};

// let _fork = childForker.fork;
//
// childForker.fork = function(path, forkArgs, forkOptions) {
//     "use strict";
//
//     console.error('>>>>>>>>>>>>>> ENV <<<<<<<<<<<<<', process.env);
//
//     let childProcess = _fork(path, forkArgs, forkOptions);
//     childProcess.stdout.on('data', function(data) {
//
//     });
//
//     return childProcess;
// };
 console.log = exports.general;