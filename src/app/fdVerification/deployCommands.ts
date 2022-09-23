import chalk from 'chalk'
import Discord from 'discord.js'
import { REST } from '@discordjs/rest' // Discord API
import { timestamp } from '../initial.js'

// -------------------------------------------------------------------------------

const commands = [
	new Discord.SlashCommandBuilder()
		/* Staff / Commands */
		.setName('staff')
		.setDescription('All staff commands for verification')
		.setDMPermission(false)
		.addSubcommandGroup((subcommandGroup) =>
			subcommandGroup
				.setName('verification')
				.setDescription('Verification commands')
				.addSubcommand((subcommand) =>
					subcommand
						.setName('resend')
						.setDescription('Resend verification to a user')
						.addUserOption((option) =>
							option
								.setName('user')
								.setDescription(
									'The user you want to resend the verification application to'
								)
								.setRequired(true)
						)
				)
		),

	new Discord.SlashCommandBuilder()
		.setName('help')
		.setDescription('Having issues with verification?'),
]

const rest = new REST({ version: '10' }).setToken(
	process.env.fdVerificationToken!
)

rest.put(
	Discord.Routes.applicationCommands(process.env.fdVerificationClientID!),
	{ body: commands }
)
	.then(() =>
		console.log(
			chalk.white(timestamp),
			chalk.underline.blueBright('Floofy Den Verification'),
			chalk.greenBright(' Successfully registered slash commands')
		)
	)
	.catch(console.error)
