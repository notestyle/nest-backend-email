const winston = require('winston');
require('winston-daily-rotate-file');
const { combine, timestamp, printf } = winston.format;

const fs = require('fs');
require('dotenv').config();

const logDir = process.env.LOG_FOLDER || './logs/';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const config = {
  dirname: logDir,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: false,
  maxSize: '20m',
  maxFiles: '7d',
};

function getLogger({ filename, level = 'info' }) {
  const customFormat = printf(({ level, message, timestamp }) => {
    return `[${timestamp}] ${level}: ${message}`;
  });

  const transports = [
    new winston.transports.DailyRotateFile(
      Object.assign(
        { level: 'error', filename: `${filename}-error-%DATE%.log` },
        config
      )
    ),
    new winston.transports.DailyRotateFile(
      Object.assign(
        { level: 'info', filename: `${filename}-info-%DATE%.log` },
        config
      )
    ),
  ];

  if (process.env.NODE_ENV !== 'production') {
    transports.push(new winston.transports.Console({ level }));
  }

  const logger = winston.createLogger({
    level: process.env.LOG_LEVEL,
    format: combine(timestamp(), customFormat),
    transports,
  });

  return logger;
}

module.exports = {
  logger: getLogger({ filename: 'api', level: 'info' }),
};
