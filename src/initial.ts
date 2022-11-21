import './dotenv/config.js';

import chalk from 'chalk';
import Discord from 'discord.js';
import * as Sentry from '@sentry/node';

// -------------------------------------------------------------------------------

chalk.level = 3; // Configuring Chalk
export function timestamp() {
  // Timestamps for CLI
  const date = new Date();
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${pad(date.getUTCMonth())}-${pad(date.getUTCDate())}-${pad(date.getUTCFullYear())} ${pad(
    date.getUTCHours()
  )}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
}
export const client = new Discord.Client({
  // Configure Main Bot Permissions
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildVoiceStates,
  ],
});
export const client2 = new Discord.Client({
  // Configure Secondary Bot Permissions
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
  ],
});

// -------------------------------------------------------------------------------

const devMode = process.argv.includes('dev');

console.log(
  chalk.white(timestamp()),
  chalk.underline.magentaBright('Startup'),
  ' Booting & connecting to database...'
);
client.login(process.env.BOT_TOKEN);
client.once('ready', () => {
  import('./index.js');
});

if (!devMode && process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
  process.on('unhandledRejection', err => {
    Sentry.captureException(err);
  });
}
