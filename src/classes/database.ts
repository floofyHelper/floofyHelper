import { PrismaClient } from '@prisma/client';

import Logger from './logger';

export default class Database {
  db: PrismaClient;
  console: Logger;

  constructor() {
    this.db = new PrismaClient();
    this.console = new Logger('Database');
  }

  async start() {
    await this.db.$connect().then(() => {
      this.console.success('Connected to database');
    });
  }
}
