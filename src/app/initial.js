import Sapphire from '@sapphire/framework'
import * as dotenv from 'dotenv' // .env File
dotenv.config()

const client = new Sapphire.SapphireClient({
	intents: ['GUILDS', 'GUILD_MEMBERS'],
})

client.login(process.env.fdVerificationToken)
console.log('ready')
