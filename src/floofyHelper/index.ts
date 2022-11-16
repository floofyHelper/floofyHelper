import chalk from 'chalk';
import { timestamp, client } from '../initial.js';
console.log(
  chalk.white(timestamp),
  chalk.underline.magentaBright('Startup'),
  ` ${client.user?.username} files found, starting bot...`
);

import Discord from 'discord.js';
