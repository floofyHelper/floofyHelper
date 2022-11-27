import { PrismaClient } from '@prisma/client';

export default class Database {
  db: PrismaClient;

  constructor() {
    this.db = new PrismaClient();
  }

  async start() {
    await this.db.$connect();
    console.log('Connected to database!');
  }
}
