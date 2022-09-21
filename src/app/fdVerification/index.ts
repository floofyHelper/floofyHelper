import chalk from 'chalk'
import { timestamp } from '../initial.js'
console.log(
	chalk.white(timestamp),
	chalk.underline.magenta('Startup'),
	'Floofy Den Verification file found, starting bot'
)

import Sapphire from '@sapphire/framework' // Discord API
import * as dotenv from 'dotenv' // .env File
dotenv.config()

const client = new Sapphire.SapphireClient({
	intents: ['GUILDS', 'GUILD_MEMBERS'],
})

client.login(process.env.fdVerificationToken)
