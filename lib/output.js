const config       = require('./config');
const uuid         = require('uuid');
const container    = require('safebox').container;
const apersistence = require('apersistence');
const Deque        = require('double-ended-queue');
const logsModel    = require('./models/LogApersistenceModel');
let Rx             = require('rxjs/Rx');

const consolePrint     = console.info;
let logSubject         = new Rx.Subject();
let persistence        = undefined;
let persistenceSubject = new Rx.BehaviorSubject(undefined);


/**
 * Function that writes an object to a stream
 * @param output - a stream where the log will be written to or undefined to be printed on stdout (currently not in use)
 * @param {object} log
 */
module.exports = function (output, log) {
    "use strict";

    logSubject.next(log);
};

let persistenceAvailability = persistenceSubject
                                  .switchMap((persistence) => persistence ? logSubject : Rx.Observable.never());

let bufferedLogs = logSubject.buffer(persistenceAvailability);

bufferedLogs
    .concatAll() //bufferedLogs returns an array, concatAll emits each value individually
    .map(log => {
        "use strict";
        let id = uuid.v4().split('-').join('');
        let formattedLog = apersistence.createRawObject('Logs', id);
        persistence.externalUpdate(formattedLog, log);
        return formattedLog;
    })
    .do(log => {
        "use strict";
        consolePrint('LOGGER: ', log.message);
        persistence.save(log, function (err, result) {
            if (err) {
                consolePrint(err);
                logSubject.next(log);
            }
        });
    })
    .subscribe();


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





