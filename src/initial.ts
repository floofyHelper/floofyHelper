import './dotenv/config.js';

import * as Sentry from '@sentry/node';

import Client from './classes/client.js';
import Database from './classes/database.js';
import Server from './classes/server.js';

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
