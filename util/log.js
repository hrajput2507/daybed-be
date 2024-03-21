const winston = require('winston');
const path = require('path');
const config = require('../config');

require('winston-daily-rotate-file');

const rotateTransport = new (winston.transports.DailyRotateFile)({
  filename: path.resolve(config.logging.path),
  datePattern: 'YYYY-MM-DD',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  prepend: true,
  maxFiles: config.logging.log_days || '7d',
});

const consoleTransport = new (winston.transports.Console)({
  colorize: true,
  format: winston.format.combine(
    winston.format.timestamp(),
    // winston.format.colorize(),
    winston.format.json()
  ),
});

const transports = [];

if (process.env.NODE_ENV !== 'production') {
  transports.push(consoleTransport);
}
transports.push(rotateTransport);

const logger = winston.createLogger({
  level: (config.logging && config.logging.level) || 'error',
  transports,
});

module.exports = logger;
