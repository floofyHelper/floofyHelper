import chalk from 'chalk'
import { timestamp } from '../initial.js'
console.log(
	chalk.white(timestamp),
	chalk.underline.magenta('Startup'),
	' Floofy Den Verification files found, starting bot'
)

import Discord from 'discord.js' // Discord API
import fs from 'node:fs' // File System
import path from 'node:path'

const client = new Discord.Client({
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMembers,
	],
})

client.once('ready', () => {
	console.log(
		chalk.white(timestamp),
		chalk.underline.magenta('Startup'),
		chalk.green(` ${client.user?.tag} is logged in`)
	)
	/* client.user.setPresence({
		activities: [{ name: `${client.guild.memberCount} users`, type: Discord.ActivityType.Watching }],
		status: 'online',
	})
}) */
})

client.login(process.env.fdVerificationToken)
