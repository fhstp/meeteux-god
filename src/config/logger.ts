import * as Winston from 'winston';

export default class Logger {

    private static _instance;
    private _logger;

    private constructor()
    {
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

    public info(message: string)
    {
        this._logger.info(message);
    }

    public error(message: string)
    {
        this._logger.error(message);
    }

    public log(level: string, message: string)
    {
        this._logger.log(level, message);
    }

    public static getInstance(): Logger
    {
        if(Logger._instance === null || Logger._instance === undefined)
        {
            Logger._instance = new Logger();
        }

        return Logger._instance;
    }
}