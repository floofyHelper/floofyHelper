import './dotenv/config.js';
import Client from './classes/client.js';
// @ts-ignore
import Database from './classes/database.js';
import Server from './classes/server.js';

import Discord from 'discord.js';
import * as Sentry from '@sentry/node';

// -------------------------------------------------------------------------------

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

const { BOT_APPLICATION_ID, BOT_PUBLIC_KEY, BOT_TOKEN } = process.env;
const devMode = process.argv.includes('dev');

const database = new Database();

const clients = [];
if (BOT_TOKEN && BOT_PUBLIC_KEY && BOT_APPLICATION_ID)
  clients.push(
    new Client({
      applicationId: BOT_APPLICATION_ID,
      publicKey: BOT_PUBLIC_KEY,
      token: BOT_TOKEN,
    })
  );

const server = new Server(clients, database);

if (!devMode && process.env.SENTRY_DSN) {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
  process.on('unhandledRejection', err => {
    Sentry.captureException(err);
  });
}

server.start();
