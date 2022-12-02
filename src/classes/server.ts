import Client from './client.js';
import Database from './database.js';
import Logger from './logger.js';

export default class Server {
  clients: Client[];
  database: Database;
  console: Logger;

  constructor(clients: Client[], database: Database) {
    this.clients = clients;
    this.database = database;
    this.console = new Logger('Server');
  }

  async start() {
    this.console.info('Booting server and database...');
    await this.database.start();
    for (const client of this.clients) {
      await client.start();
    }
  }
}
