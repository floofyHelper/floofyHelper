import chalk from 'chalk'
import Discord from 'discord.js' // Discord API
import { REST } from '@discordjs/rest'
import fs from 'node:fs' // File System
import yaml from 'js-yaml' // .yaml File

const config = yaml.load(fs.readFileSync('src/config/config.yml', 'utf8')) // Import The config.yaml File

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

const rest = new REST({ version: config.discordAPIVersion }).setToken(
	process.env.fdVerificationToken
)

rest.put(
	Discord.Routes.applicationCommands(process.env.fdVerificationClientId),
	{
		body: commands,
	}
)
	.then(() =>
		console.log(
			chalk.underline.blue('Floofy Den Verification'),
			'Successfully registered slash commands'
		)
	)
	.catch(console.error)
