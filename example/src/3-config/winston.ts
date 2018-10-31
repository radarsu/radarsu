import {
    WinstonDailyRotateFile, colors, moment, stripAnsi, winston, yargs, path,
} from '../import';

// setup
const level = yargs.argv.log || 'debug';
const label = `radarsu`;

// helpers
export const simpleDateFormat = (date?: Date) => {
    return `[${moment(date).format('HH:mm:ss')}]`;
};

export const dateFormat = (date?: Date) => {
    return colors.grey(simpleDateFormat(date));
};

// logging to console
const metaStringFormat = (info) => {
    let metaString = ``;
    if (info.meta instanceof Error) {
        metaString += `\n${info.meta.stack}`;
    } else if (Array.isArray(info.meta) && info.meta.length > 0) {
        info.meta.forEach((meta) => {
            if (meta instanceof Error) {
                metaString += `\n${meta.stack}`;
                return;
            }

            metaString += ` ${meta}`;
        });
    } else {
        metaString += ` ${info.meta}`;
    }
    return metaString;
};

const logFormat = winston.format.printf((info) => {
    const metaString = metaStringFormat(info);
    return `${dateFormat(info.timestamp)} [${colors.magenta(info.label)}] ${info.level}: ${colors.bold(info.message)}${metaString}`;
});

// logging to file
const fileLogFormat = winston.format.printf((info) => {
    const metaString = metaStringFormat(info);
    return `${simpleDateFormat(info.timestamp)} [${stripAnsi(info.label)}] ${info.level}: ${info.message}${metaString}`;
});

export const radarsuLogger = (fileName: string) => {
    const fileLabel = colors.cyan(path.basename(fileName.replace(/\.[^/.]+$/, '')));

    return winston.createLogger({
        transports: [
            new winston.transports.Console({
                handleExceptions: true,
                level,
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.timestamp(),
                    winston.format.label({
                        label: fileLabel,
                    }),
                    winston.format.splat(),
                    logFormat,
                ),
            }),
            new WinstonDailyRotateFile({
                datePattern: `YYYY-MM-DD_HH`,
                dirname: `data/logs`,
                filename: `%DATE%.log`,
                level,
                maxFiles: '1d',
                maxSize: '1m',
                handleExceptions: true,
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.label({
                        label: fileLabel,
                    }),
                    winston.format.splat(),
                    fileLogFormat,
                ),
            }),
        ],
    });
};

export default {
    transports: [
        new winston.transports.Console({
            handleExceptions: true,
            level,
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.timestamp(),
                winston.format.label({
                    label,
                }),
                winston.format.splat(),
                logFormat,
            ),
        }),
        new WinstonDailyRotateFile({
            datePattern: `YYYY-MM-DD_HH`,
            dirname: `data/logs`,
            filename: `%DATE%.log`,
            level,
            maxFiles: '1d',
            maxSize: '1m',
            handleExceptions: true,
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.label({
                    label,
                }),
                winston.format.splat(),
                fileLogFormat,
            ),
        }),
    ],
} as winston.LoggerOptions;
