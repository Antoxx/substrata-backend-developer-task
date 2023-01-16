import path from 'path';
import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const {
  format: { combine, timestamp, json },
  transports: { Console },
} = winston;
const logDir = path.resolve('./logs');

const infoFilter = winston.format((info) => (info.level === 'info' ? info : false));
const verboseFilter = winston.format((info) => (info.level === 'verbose' ? info : false));
const errorFilter = winston.format((info) => (info.level === 'error' ? info : false));

export const logger = winston.createLogger({
  transports: [
    new Console({
      level: 'info',
      format: combine(timestamp(), json()),
    }),
    new winstonDaily({
      level: 'verbose',
      dirname: `${logDir}/verbose`,
      filename: `%DATE%.verbose.log`,
      maxFiles: 30,
      json: false,
      zippedArchive: true,
      format: combine(verboseFilter(), timestamp(), json()),
    }),
    new winstonDaily({
      level: 'info',
      dirname: `${logDir}/info`,
      filename: `%DATE%.info.log`,
      maxFiles: 30,
      zippedArchive: true,
      format: combine(infoFilter(), timestamp(), json()),
    }),
    new winstonDaily({
      level: 'error',
      datePattern: 'YYYY-MM-DD',
      dirname: `${logDir}/error`,
      filename: `%DATE%.error.log`,
      maxFiles: 30,
      handleExceptions: true,
      zippedArchive: true,
      format: combine(errorFilter(), timestamp(), json()),
    }),
  ],
});

export const stream = {
  write: (message: string) => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  },
};
