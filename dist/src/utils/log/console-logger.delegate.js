"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLoggerDelegate = void 0;
const logger_delegate_1 = require("./logger-delegate");
class ConsoleLoggerDelegate extends logger_delegate_1.LoggerDelegate {
    constructor() {
        super();
    }
    debug(className, methodName, message, data = {}) {
        console.log(this.format(className, methodName, message, '', data));
    }
    info(className, methodName, message, data = {}) {
        console.log(this.format(className, methodName, message, '', data));
    }
    notice(className, methodName, message, data = {}) {
        console.log(this.format(className, methodName, message, '', data));
    }
    warn(className, methodName, message, data = {}) {
        console.log(this.format(className, methodName, message, '', data));
    }
    error(className, methodName, message, trace, data = {}) {
        console.log(this.format(className, methodName, message, trace, data));
    }
    crit(className, methodName, message, trace, data = {}) {
        console.log(this.format(className, methodName, message, trace, data));
    }
    alert(className, methodName, message, trace, data = {}) {
        console.log(this.format(className, methodName, message, trace, data));
    }
    emerg(className, methodName, message, trace, data = {}) {
        console.log(this.format(className, methodName, message, trace, data));
    }
    format(className, methodName, message, trace = '', data = {}) {
        let msg = `[${className}.${methodName}]: ${message}`;
        msg = msg + "\ndata: " + JSON.stringify(data);
        return (trace) ? msg + '\n' + trace : msg;
    }
}
exports.ConsoleLoggerDelegate = ConsoleLoggerDelegate;