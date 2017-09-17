const config = require('./config');
const uuid = require('uuid');
const container = require('safebox').container;
const apersistence = require('apersistence');
const Deque = require('double-ended-queue');
const logsModel = require('./models/LogApersistenceModel');

const consolePrint = console.info;


let persistence;

let messageQueue = new Deque();
let messageHashMap = {};

/**
 * Function that writes an object to a stream
 * @param output - a stream where the log will be written to or undefined to be printed on stdout (currently not in use)
 * @param {object} log
 */
module.exports = function (output, log) {
    "use strict";

    let id = uuid.v4().split('-').join('');
    messageHashMap[id] = log;


    if (persistence) {
        let failedMessaged = {};
        consolePrint("before saving: ", Object.keys(messageHashMap).length);
        for (let messageId in messageHashMap) {
            let formattedLog = apersistence.createRawObject('Logs', messageId);
            persistence.externalUpdate(formattedLog, messageHashMap[messageId]);
            // persistence.save(formattedLog, function (err, result) {
            //     if (err) {
            //         consolePrint(err);
            //         failedMessaged[messageId] = messageHashMap[messageId];
            //     }
            // });
        }
        consolePrint("after saving: ", Object.keys(failedMessaged).length);
        consolePrint("\n");
        messageHashMap = failedMessaged;
    }

    // messageQueue.push(log);
    //
    // if (persistence) {
    //     while (!messageQueue.isEmpty()) {
    //         let id = uuid.v4().split('-').join('');
    //         let formattedLog = apersistence.createRawObject('Logs', id);
    //         let message = messageQueue.peekFront();
    //         consolePrint('BEFORE SAVING: ', messageQueue.length);
    //         messageQueue.shift();
    //         //consolePrint('LOGGER: ', message.message);
    //         persistence.externalUpdate(formattedLog, message);
    //         persistence.save(formattedLog, function (err, result) {
    //             if (err) {
    //                 consolePrint('AFTER SAVING: ', messageQueue.length);
    //                 messageQueue.push(log);
    //                 break;
    //             } else { }
    //         });
    //
    //     }
    // }

};


container.declareDependency('logger', ['mysqlPersistence'], function (outOfService, mySqlPersistence) {
    "use strict";

    if (outOfService) {
        persistence = undefined;
    } else {
        mySqlPersistence.persistenceStrategy.registerConverter("longstring",
            function (value) {
                consolePrint('>>>>>>>>>>>>>>>>>>> :!!! ', value);
                let buffer = new Buffer(value, "binary");
                return 1;
            },
            function (value) {
                return value;
            },
            'blob'
        );

        mySqlPersistence.registerModel('Logs', logsModel, function (err, model) {
            if (err) {
                consolePrint(err);
            } else {
                persistence = mySqlPersistence;
            }
        });

    }

});





