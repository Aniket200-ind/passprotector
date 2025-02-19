//! src/lib/logger.ts

import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import path from 'path';

// Log file directory
const logDir = path.join(process.cwd(), 'logs');

// Log format (JSON with timestamp)
const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
  winston.format.colorize() // Add colorize to log output
);


//? Now, we have a logger that writes logs to three different files: access.log, errors.log, and combined.log. The access.log file contains only access logs, the errors.log file contains only error logs, and the combined.log file contains both access and error logs. The logs are rotated daily, and the log files are kept for 14 days, 30 days, and 30 days, respectively. The logs are also colorized when written to the console. The log files are stored in the logs directory in the project root. 


// Logger instance

const logger = winston.createLogger({
    level: 'info', // Default log level
    format: logFormat,
    transports: [
        // Access logs
    new DailyRotateFile({
        filename: `${logDir}/access.log`,
        datePattern: "YYYY-MM-DD",
        maxSize: "10m",
        maxFiles: "14d", // Keep logs for 14 days
        level: "info",
      }),
  
      // Error logs
      new DailyRotateFile({
        filename: `${logDir}/errors.log`,
        datePattern: "YYYY-MM-DD",
        maxSize: "10m",
        maxFiles: "30d", // Keep error logs for 30 days
        level: "error",
      }),
  
      // Combined logs (both info and errors)
      new DailyRotateFile({
        filename: `${logDir}/combined.log`,
        datePattern: "YYYY-MM-DD",
        maxSize: "20m",
        maxFiles: "30d",
      }),
    ]
});

// Console transport for development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
        )
    }));
}

export default logger;