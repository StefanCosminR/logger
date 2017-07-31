/**
 * Config file that sets configuration similar to process.env but local to module
 *
 */

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