import chalk from 'chalk'; // CLI Colors
import Discord from 'discord.js'; // Discord API
import * as dotenv from 'dotenv'; // .env File

// -------------------------------------------------------------------------------

chalk.level = 3; // Configuring Chalk
dotenv.config({ path: '.env' }); // Configuring Dotenv
export function timestamp() {
  // Timestamps for CLI
  const date = new Date();
  const pad = (value: number) => value.toString().padStart(2, '0');
  return `${pad(date.getMonth())}-${pad(date.getDate())}-${pad(date.getFullYear())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
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
client.login(process.env.floofyHelperToken);
client.once('ready', () => {
  import('./index.js');
});
