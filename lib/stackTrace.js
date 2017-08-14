const stackTrace = require('stack-trace');

function getStackTraceParsedData() {
    let trace = stackTrace.get();
    let caller = trace[3];
    return {
        typeName: caller.getTypeName(),
        functionName: caller.getFunctionName() || '',
        methodName: caller.getMethodName(),
        filePath: caller.getFileName(),
        lineNumber: caller.getLineNumber(),
        topLevelFlag: caller.isToplevel(),
        nativeFlag: caller.isNative(),
        evalFlag: caller.isEval(),
        evalOrigin: caller.getEvalOrigin()
    };
}

module.exports = {
    getStackTraceParsedData: getStackTraceParsedData
};