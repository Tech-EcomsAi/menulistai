import { addApplicationLog } from "@database/loggers/applicationLogger";
import { getDateObj, isDevelopment, isProduction } from "@util/utils";

const enableDatabaseLogging = isProduction();
const enableConsoleLogging = isDevelopment();

export type ApplicationLogType = {
    label: any;
    data: any;
    createdOn?: any;
    vscodeLink?: string;
    filePath?: string,
    logId?: any,
    type: any,
    createdBy?: string;
    modifiedBy?: string;
    role?: string;
    sId?: number;
    tId?: number;
    uId?: string;
    cause?: string;
    location?: string;
    message?: string;
    name?: string;
    stack?: string;
    userAgent?: any
}

export const LOGS_TYPE = [
    { type: 'info', key: 'info', tagColor: "green", color: "blue" },
    { type: 'warn', key: 'warn', tagColor: "warning", color: "orange" },
    { type: 'error', key: 'error', tagColor: "error", color: "red" },
    { type: 'trace', key: 'trace', tagColor: "volcano", color: "yellow" },
    { type: 'debug', key: 'debug', tagColor: "processing", color: "green" },
    { type: 'log', key: 'log', tagColor: "cyan", color: "green" },
]

export type LogType = 'info' | 'warn' | 'error' | 'trace' | 'debug' | 'log';

const logToConsole = (type: LogType, log, data: any = "") => {
    if (!enableConsoleLogging) return
    var logDetails: ApplicationLogType = log
    if (!enableDatabaseLogging) {
        const originalStackTrace = new Error().stack.split('\n');
        // logDetails = {
        //     label: data[1],
        //     data: data[2],
        //     type,
        //     filePath: getFileLink(originalStackTrace).filePath,
        //     vscodeLink: getFileLink(originalStackTrace).vscodeLink,
        // }
    }

    switch (type) {
        case 'info':
            console.info('%c info log:', 'background: blue; color: white;', logDetails);
            break;
        case 'warn':
            console.warn('%c warn log:', 'background: orange; color: white;', logDetails);
            break;
        case 'error':
            console.error('%c error log:', 'background: red; color: white;', logDetails);
            break;
        case 'trace':
            console.trace('%c trace log:', 'background: yellow; color: black;', logDetails);
            break;
        case 'debug':
            console.debug('%c debug log:', 'background: green; color: white;', logDetails.label, logDetails.data, logDetails.vscodeLink);
        case 'log':
        default:
            console.log('%c log:', 'background: green; color: white;', log);
    }
}

const logger = (() => {

    const logToDatabase = async (type: LogType, ...messages) => {
        const originalStackTrace = new Error().stack.split('\n');
        var logDetails: ApplicationLogType = {
            label: messages[0],
            data: messages[1],
            createdOn: getDateObj(new Date()).dateTimeDisplay,
            filePath: getFileLink(originalStackTrace).filePath,
            vscodeLink: getFileLink(originalStackTrace).vscodeLink,
            logId: "",
            type,
            userAgent: window?.navigator?.userAgent || ""
        }
        if (type != "debug" && type != "error" && type != "log") {//this types are only for devlopment purpose
            logDetails.logId = await addApplicationLog(logDetails);
        } else {
            delete logDetails.createdOn;
        }

        logToConsole(type, logDetails)
    };

    const fun = enableDatabaseLogging ? logToDatabase : logToConsole;
    return {
        debug: fun.bind(null, 'debug'),
        info: fun.bind(null, 'info'),
        log: fun.bind(null, 'log'),
        warn: fun.bind(null, 'warn'),
        error: fun.bind(null, 'error'),
        trace: fun.bind(null, 'trace'),
    };
})();

export default logger;

const getFileLink = (originalStackTrace) => {
    let vscodeLink = "";
    let filePath = "";
    const callerLine = originalStackTrace[2]; // Adjust the index based on where you want to capture the stack trace
    if (callerLine) {
        filePath = callerLine.split("/./src")[1]
        filePath = filePath?.substring(0, filePath.length - 1);
        if (filePath) {
            vscodeLink = `vscode://file//Users/danny/Projects/EcomsAi/dashboard/src/${filePath}`;
        }
    }
    return { filePath, vscodeLink };
};