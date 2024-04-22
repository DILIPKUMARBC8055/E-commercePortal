import fs from "fs";
import winston from "winston";
const fsPromise = fs.promises;

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "logging data" },
  transports: [new winston.transports.File({ filename: "logs.txt" })],
});

// async function log(logdata) {
//   try {
//     logdata = `\n ${new Date().toString()} - ${logdata}`;
//     await fsPromise.appendFile("log.txt", logdata);
//   } catch (error) {
//     console.log(error);
//   }
// }
const loggerMiddleware = async (req, res, next) => {
  if (!req.url.includes("signin")) {
    const logdata = `${req.url}- ${JSON.stringify(req.body)}`;
    // await log(logdata);
    logger.info(logdata);
  }
  next();
};
export default loggerMiddleware;
