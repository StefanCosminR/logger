module.exports = {
    id: {
        type: "string",
        pk: true,
        length: 512
    },
    type: {
        type: 'string',
        length: 128
    },
    message: {
        type: 'string',
        length: 2000
    },
    timestamp: {
        type: 'string',
        length: 256
    },
    functionName: {
        type: 'string',
        length: 256
    },
    fileName: {
        type: 'string',
        length: 256
    },
    lineNumber: {
        type: 'string',
        length: 128
    }
};