import chalk from 'chalk'
import { timestamp, client2 } from '../initial.js'
console.log(
	chalk.white(timestamp),
	chalk.underline.magentaBright('Startup'),
	` ${client2.user?.username} files found, starting bot...`
)

import Discord from 'discord.js' // Discord API
import fs from 'node:fs' // File System
import path from 'node:path'
import('./deployCommands.js')

console.log(
	chalk.white(timestamp),
	chalk.underline.magentaBright('Startup'),
	chalk.greenBright(` ${client2.user?.tag} is logged in`)
)
/*	client.user.setPresence({
		activities: [{ name: `${client.guild.memberCount} users`, type: Discord.ActivityType.Watching }],
		status: 'online',
	})
})	*/
