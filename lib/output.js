const config = require('./config');
const uuid = require('uuid');
const container = require('safebox').container;
const apersistence = require('apersistence');
const Deque = require('double-ended-queue');
const logsModel = require('./models/LogApersistenceModel');
let Rx = require('rxjs/Rx');

const consolePrint = console.info;

let logSubject = new Rx.Subject();

let persistence = undefined;

let persistenceSubject = new Rx.BehaviorSubject(undefined);



/**
 * Function that writes an object to a stream
 * @param output - a stream where the log will be written to or undefined to be printed on stdout (currently not in use)
 * @param {object} log
 */
module.exports = function (output, log) {
    "use strict";

    logSubject.next(log);

    //this is a fallback code in case that RxJS fails somewhere

    /*messageQueue.push(log);

    if (persistence) {
        while (!messageQueue.isEmpty()) {
            let id = uuid.v4().split('-').join('');
            let formattedLog = apersistence.createRawObject('Logs', id);
            let message = messageQueue.peekFront();
            //consolePrint('BEFORE SAVING: ', messageQueue.length);
            messageQueue.shift();
            //consolePrint('LOGGER: ', message.message);
            persistence.externalUpdate(formattedLog, message);
            persistence.save(formattedLog, function (err, result) {
                if (err) {
                    consolePrint('AFTER SAVING: ', messageQueue.length);
                    messageQueue.push(log);
                } else { }
            });

        }
    }*/
};

let persistenceAvailability = persistenceSubject.switchMap((persistence) => persistence ? logSubject : Rx.Observable.never());


let bufferedLogs = logSubject.buffer(persistenceAvailability);

bufferedLogs
    .concatAll()
    .map(log => {
        "use strict";
        let id = uuid.v4().split('-').join('');
        let formattedLog = apersistence.createRawObject('Logs', id);
        persistence.externalUpdate(formattedLog, log);
        return formattedLog;
    })
    .subscribe(log => {
        "use strict";
        persistence.save(log, function(err, result) {
            if(err) {
                consolePrint(err);
                logSubject.next(log);
            }
        });
    });


container.declareDependency('logger', ['mysqlPersistence'], function (outOfService, mySqlPersistence) {
    "use strict";

    if (outOfService) {
        persistence = undefined;
        persistenceSubject.next(undefined);
    } else {
        mySqlPersistence.registerModel('Logs', logsModel, function (err, model) {
            if (err) {
                consolePrint(err);
            } else {
                persistence = mySqlPersistence;
                persistenceSubject.next(mySqlPersistence);
            }
        });

    }

});





