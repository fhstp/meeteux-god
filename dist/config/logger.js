"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Winston = require("winston");
class Logger {
    constructor() {
        const level = process.env.LOGGER_LEVEL;
        const errorFile = process.env.ERROR_LOGGER_FILE;
        const combinedFile = process.env.COMBINED_LOGGER_FILE;
        this._logger = Winston.createLogger({
            level: level,
            format: Winston.format.json(),
            transports: [
                new Winston.transports.File({ filename: errorFile, level: 'error' }),
                new Winston.transports.File({ filename: combinedFile })
            ]
        });
        if (process.env.NODE_ENV !== 'production') {
            console.log('Winston - Enabled Console logging!');
            this._logger.add(new Winston.transports.Console({
                format: Winston.format.simple()
            }));
        }
    }
    info(message) {
        this._logger.info(message);
    }
    error(message) {
        this._logger.error(message);
    }
    log(level, message) {
        this._logger.log(level, message);
    }
    static getInstance() {
        if (Logger._instance === null || Logger._instance === undefined) {
            Logger._instance = new Logger();
        }
        return Logger._instance;
    }
}
exports.default = Logger;
//# sourceMappingURL=logger.js.map