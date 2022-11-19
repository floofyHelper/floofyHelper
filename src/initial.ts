import chalk from 'chalk'; // CLI Colors
import Discord from 'discord.js'; // Discord API
import * as dotenv from 'dotenv'; // .env File

// -------------------------------------------------------------------------------

chalk.level = 3; // Configuring Chalk
dotenv.config({ path: '.env' }); // Configuring Dotenv
const { BOT_TOKEN } = process.env;
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

if (!devMode) {
  dotenv.config({ path: '.env.production', override: true });
}

console.log(
  chalk.white(timestamp()),
  chalk.underline.magentaBright('Startup'),
  ' Booting & connecting to database...'
);
client.login(BOT_TOKEN);
client.once('ready', () => {
  import('./index.js');
});
