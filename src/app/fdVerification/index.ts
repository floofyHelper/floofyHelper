import chalk from 'chalk'
import { timestamp } from '../initial.js'
console.log(
	chalk.white(timestamp),
	chalk.underline.magenta('Startup'),
	'Floofy Den Verification file found, starting bot'
)

import Sapphire from '@sapphire/framework' // Discord API
import fs from 'node:fs' // File System
import path from 'node:path'
import * as dotenv from 'dotenv' // .env File
dotenv.config()

const client = new Sapphire.SapphireClient({
	intents: ['GUILDS', 'GUILD_MEMBERS'],
})

/* client.once('ready', () => {
	console.log(
		chalk.underline.magenta('Startup'),
		chalk.green(`${client.user.tag} is logged in`)
	)
	/* client.user.setPresence({
		activities: [{ name: `${client.guild.memberCount} users`, type: Discord.ActivityType.Watching }],
		status: 'online',
	})
}) */

client.login(process.env.fdVerificationToken)
