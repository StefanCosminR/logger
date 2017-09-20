const path = require('path');

function formatMessage(msg) {
    "use strict";

    let formattedMessage = "";


    if (Array.isArray(msg)) {
        let msgLength = msg.length;
        for (let i = 0; i < msgLength; ++i) {
            formattedMessage += formatMessage(msg[i]) + ' '; //JSON.Stringify adds extra "" to strings
        }
        formattedMessage = formattedMessage.substring(0, formattedMessage.length - 1);
    }
    else if (typeof msg === 'object') {
        formattedMessage = JSON.stringify(msg);
    } else {
        formattedMessage = msg;
    }


    return formattedMessage;
}

function formatFileName(filePath) {
    "use strict";

    let fileName = '';


    if (filePath) {
        try {
            fileName = path.basename(filePath);
        } catch (e) {
            console.error(e);
        }
    } else {
        fileName = getCurrentSwarm() || '';
    }


    return fileName;
}


module.exports = {
    formatMessage,
    formatFileName
};