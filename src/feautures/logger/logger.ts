import * as winston from 'winston';
import { Logform } from 'winston';

function getLoggerFormat(json: boolean): winston.Logform.Format {
    const formats: Logform.Format[] = [
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
        winston.format.ms(),
    ];
    if (json) {
        formats.push(winston.format.json({ deterministic: true, space: 0 }));
    } else {
        formats.push(
            winston.format.colorize(),
            winston.format.align(),
            { transform: info => ({ ...info, message: info.message.trimEnd() }) },
            winston.format.printf((info) => {
                const tails: [string, string][] = Object
                    .keys(info)
                    .filter((k) => !['timestamp', 'level', 'message'].includes(k))
                    .map((k) => [k, JSON.stringify(info[k])]);
                const tail = tails.map(([k, v]) => `${k}: ${v}`).join('; ');
                return `${info.timestamp} [${info.level}] ${info.message}; ${tail}`;
            }),
        );
    }
    return winston.format.combine(...formats);
}

export function getLogger(options: LoggerOptions): winston.Logger {
    const transports = [
        new winston.transports.Console({ format: getLoggerFormat(options.format == 'json') }),
    ];
    return winston.createLogger({
        transports: transports,
        level: options.level ?? 'info',
    });
}

export type LoggerOptions = {
    format: LoggerFormat | null
    level: LoggerLevel | null
}

export const LoggerLevelOptions = [
    'error',
    'warn',
    'info',
    'http',
    'verbose',
    'debug',
    'silly'
] as const

export type LoggerLevel = (typeof LoggerLevelOptions)[number]


export const LoggerFormatOptions = [
    'text',
    'json'
] as const

export type LoggerFormat = (typeof LoggerFormatOptions)[number]

