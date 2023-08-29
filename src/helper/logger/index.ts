import { createLogger, transports, format } from "winston";
import config from "../../config/config";

console.log(config);

const logger = createLogger({
  transports: [
    new transports.File({
      dirname: config.DIRNAME,
      filename: "logs.log",
    }),
  ],
  format: format.combine(
    format.timestamp(),
    format.printf(({
      timestamp, level, message, service,
    }) => `[${timestamp}] ${service} ${level}: ${message}`),
  ),
  defaultMeta: {
    service: "logs",
  },
});

export default logger;
