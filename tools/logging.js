import chalk from "chalk";
import morgan from "morgan";

morgan.token('customMessage', (req, res) => {
  return req.customLogMessage; 
});

const customLogFormat = (tokens, req, res) => {
  const timestamp = new Date().toISOString();
  const method = tokens.method(req, res);
  const url = tokens.url(req, res);
  const status = tokens.status(req, res);
  const responseTime = tokens['response-time'](req, res);

  const timestampColor = chalk.gray(timestamp);
  const methodColor = status >= 400 ? chalk.red(method) : chalk.green(method);
  const urlColor = status >= 400 ? chalk.red(url) : chalk.green(url);
  const statusColor = status >= 400 ? chalk.red(status) : chalk.green(status);
  const responseTimeColor = responseTime > 500 ? chalk.red(responseTime) : chalk.yellow(responseTime);

  const customMessage =  req.customLogMessage ? `| ${chalk.blue(req.customLogMessage)}` : '';

  return `VISH-${timestampColor} | ${methodColor} ${urlColor} | ${statusColor} | ${responseTimeColor} ms ${customMessage}`;
};

const logger = {
  log: (message) => {
    const timestamp = new Date().toISOString();
    console.log(`VISH-${chalk.gray(timestamp)} | ${chalk.green('LOG')} ${message}`);
  },
  error: (message) => {
    const timestamp = new Date().toISOString();
    console.error(`VISH-${chalk.gray(timestamp)} | ${chalk.red('ERROR')} ${message}`);
  },
  info: (message) => {
    const timestamp = new Date().toISOString();
    console.info(`VISH-${chalk.gray(timestamp)} | ${chalk.blue('INFO')} ${message}`);
  },
};

export default logger;
export { customLogFormat };