import Client from './client';
import Database from './database';
import Logger from './logger';

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
