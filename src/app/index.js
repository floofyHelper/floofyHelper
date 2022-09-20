import Sapphire from '@sapphire/framework';
import * as dotenv from 'dotenv'; dotenv.config(); // .env File
const client = new Sapphire.SapphireClient({ intents: [
    'GUILDS',
    'GUILD_MEMBERS']});
client.login(process.env.fdVerificationToken);