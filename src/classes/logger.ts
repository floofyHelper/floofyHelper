import chalk from 'chalk';
chalk.level = 3;

export default class Logger {
  prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  getTimestamp() {
    const date = new Date();
    const pad = (value: number) => value.toString().padStart(2, '0');
    return `${pad(date.getUTCMonth())}-${pad(date.getUTCDate())}-${pad(
      date.getUTCFullYear()
    )} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
  }

  print(logType: any, content: any, color: string, type: string, typeColor: string) {
    logType(
      chalk`{${color} [${this.getTimestamp()}]} {${typeColor} ${type}} {${color} [${this.prefix}]}`,
      content
    );
  }

  log = this.info;

  startup(content: any) {
    this.print(console.log, content, 'magentaBright.bold', ' STARTUP ', 'bgMagentaBright.black');
  }

  info(content: any) {
    this.print(console.log, content, 'blueBright.bold', ' INFO ', 'bgBlueBright.black');
  }

  success(content: any) {
    this.print(console.log, content, 'greenBright.bold', ' INFO ', 'bgGreenBright.black');
  }

  error(content: any) {
    this.print(console.error, content, 'redBright.bold', ' ERROR ', 'bgRedBright.black');
  }

  warn(content: any) {
    this.print(console.warn, content, 'yellowBright.bold', ' WARN ', 'bgYellowBright.black');
  }
}
