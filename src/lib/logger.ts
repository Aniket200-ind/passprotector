import winston from "winston";

const logFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json()
);

const isProd = process.env.NODE_ENV === "production";
const isVercel = !!process.env.VERCEL;

// In Vercel/production, avoid any filesystem transports.
const transports: winston.transport[] = [];

if (!isProd || !isVercel) {
  // Local/dev: allow console with colors
  transports.push(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
} else {
  // Prod on Vercel: still log to console (captured by Vercel)
  transports.push(new winston.transports.Console({ format: logFormat }));
}

const logger = winston.createLogger({
  level: "info",
  format: logFormat,
  transports,
});

export default logger;