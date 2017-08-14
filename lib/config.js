/**
 * Config file that sets configuration similar to process.env but local to module
 *
 */
let apersistence = require('/home/stefan/Documents/projects/SwarmESBExtended/node_modules/apersistence');
let mysql = require('/home/stefan/Documents/projects/SwarmESBExtended/node_modules/mysql');
let config = {};

exports.set = function(name, obj) {
    'use strict';

    config[name] = obj;
};

exports.get = function(name) {
    'use strict';

    return config[name];
};

exports.has = function(name) {
    'use strict';

    return typeof config[name] !== 'undefined';
};




