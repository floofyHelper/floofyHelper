import chalk from 'chalk' // CLI Colors
import inquirer from 'inquirer' // Interactive CLI
import Discord from 'discord.js' // Discord API
import * as dotenv from 'dotenv' // .env File
import YAML from 'yaml' // .yml File
import fs from 'node:fs' // File System
import kill from 'node:process'

// -------------------------------------------------------------------------------

chalk.level = 3 // Configuring Chalk
dotenv.config({ path: '.env' }) // Configuring Dotenv
export const config = YAML.parse(
	// Import The config.yaml File
	fs.readFileSync('src/config/config.yml', 'utf8')
)
export const timestamp = `${
	// Configure the timestamp constant
	new Date().getMonth() + 1
}-${new Date().getDate()}-${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
export const client = new Discord.Client({
	// Configure Main Bot Permissions
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMembers,
		Discord.GatewayIntentBits.GuildVoiceStates,
	],
})
export const client2 = new Discord.Client({
	// Configure Verification Bot Permissions
	intents: [
		Discord.GatewayIntentBits.Guilds,
		Discord.GatewayIntentBits.GuildMembers,
		Discord.GatewayIntentBits.GuildMessages,
	],
})

// -------------------------------------------------------------------------------

console.log(
	chalk.white(timestamp),
	chalk.underline.magentaBright('Startup'),
	' Booting...'
)
client.login(process.env.floofyHelperToken)
client.once('ready', () => {
	client2.login(process.env.fdVerificationToken)
	client2.once('ready', () => {
		inquirer
			.prompt([
				{
					type: 'list',
					message: 'Which environment do you want to boot into?',
					name: 'environment',
					choices: [
						{
							name: 'Development',
						},
						{
							name: 'Production',
						},
					],
				},
			])
			.then((answers) => {
				if (answers.environment === 'Development') {
					inquirer
						.prompt([
							{
								type: 'list',
								message: 'Which bot(s) do you want to boot?',
								name: 'development',
								choices: [
									{
										name: `${client.user?.username}`,
									},
									{
										name: `${client2.user?.username}`,
									},
									{
										name: 'All',
									},
								],
							},
						])
						.then((answers) => {
							if (
								answers.development ===
								`${client.user?.username}`
							) {
								client2.destroy()
								client2.once('shardDisconnect', () => {
									import('./floofyHelper/index.js')
									console.log(
										chalk.white(timestamp),
										chalk.underline.magentaBright(
											'Startup'
										),
										` Starting ${client.user?.username}...`
									)
								})
							} else if (
								answers.development ===
								`${client2.user?.username}`
							) {
								client.destroy()
								client.once('shardDisconnect', () => {
									import('./fdVerification/index.js')
									console.log(
										chalk.white(timestamp),
										chalk.underline.magentaBright(
											'Startup'
										),
										` Starting ${client2.user?.username}...`
									)
								})
							} else if (answers.development === 'All') {
								import('./floofyHelper/index.js')
								import('./fdVerification/index.js')
								console.log(
									chalk.white(timestamp),
									chalk.underline.magentaBright('Startup'),
									` Starting ${client.user?.username} and ${client2.user?.username}...`
								)
							}
						})
				} else if (answers.environment === 'Production') {
					inquirer
						.prompt([
							{
								type: 'list',
								message: `Are you sure? ${chalk.red(
									'(This will boot the bot to'
								)} ${chalk.red.underline(
									'every'
								)} ${chalk.redBright('server!)')}`,
								name: 'production',
								choices: [
									{
										name: 'No',
									},
									{
										name: 'Yes',
									},
								],
							},
						])
						.then((answers) => {
							if (answers.production === 'No') {
								console.log(
									chalk.yellowBright.bold(
										'Killing instance, restart bot to deploy'
									)
								)
								kill
							}
							if (answers.production === 'Yes') {
								console.log(
									chalk.white(timestamp),
									chalk.magentaBright.underline('Startup'),
									' Please wait...'
								)
								dotenv.config({
									path: '.env.production',
									override: true,
								})
								client.destroy()
								client.once('shardDisconnect', () => {
									client2.destroy()
									client2.once('shardDisconnect', () => {
										client.login(
											process.env.floofyHelperToken
										)
										client.once('shardReady', () => {
											client2.login(
												process.env.fdVerificationToken
											)
											client2.once('shardReady', () => {
												import(
													'./floofyHelper/index.js'
												)
												import(
													'./fdVerification/index.js'
												)
												console.log(
													chalk.white(timestamp),
													chalk.underline.magentaBright(
														'Startup'
													),
													` Starting ${client.user?.username} and ${client2.user?.username}...`
												)
											})
										})
									})
								})
							}
						})
				}
			})
	})
})
