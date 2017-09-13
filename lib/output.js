const config = require('./config');
const uuid = require('uuid');
const container = require('safebox').container;
const apersistence = require('apersistence');
const Deque = require('double-ended-queue');
const logsModel = require('./models/LogApersistenceModel');


let persistence;

let messageQueue = new Deque();

/**
 * Function that writes an object to a stream
 * @param output - a stream where the log will be written to or undefined to be printed on stdout (currently not in use)
 * @param {object} log
 */
module.exports = function (output, log) {
    "use strict";

    messageQueue.push(log);

    if (persistence) {
        while (!messageQueue.isEmpty()) {
            let id = uuid.v4().split('-').join('');
            let formattedLog = apersistence.createRawObject('Logs', id);
            let message = messageQueue.peekFront();
            messageQueue.shift();
            console.info('LOGGER: ', message.message);
            persistence.externalUpdate(formattedLog, message);
            persistence.save(formattedLog, function (err, result) {
                // console.error('>>>>>>>>>>>>>> SAVED ERROR <<<<<<<<<<<<<\n', err);
                if (err) {
                    console.error(err);
                } else {
                    //console.error('>>>>>> SAVED: <<<<<<<<<<<', messageQueue.shift());
                }
            });

        }
    }

};


container.declareDependency('logger', ['mysqlPersistence'], function (outOfService, mySqlPersistence) {
    "use strict";

    if (outOfService) {
        persistence = undefined;
    } else {
        mySqlPersistence.registerModel('Logs', logsModel, function (err, model) {
            if (err) {
                console.error(err);
            } else {
                persistence = mySqlPersistence;
            }
        });

    }

});





