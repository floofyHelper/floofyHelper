import chalk from 'chalk'
import inquirer from 'inquirer'
import fs from 'node:fs' // File System
import yaml from 'js-yaml' // .yaml File
import * as dotenv from 'dotenv'
dotenv.config() // .env File

chalk.level = 3 // Configuring Chalk
const client = yaml.load(fs.readFileSync('src/config/config.yml', 'utf8')) // Import The config.yaml File

export const timestamp = `${
	new Date().getMonth() + 1
}-${new Date().getDate()}-${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`

// -------------------------------------------------------------------------------

/* if (client === 'stable') {
	console.log(
		chalk.underline.magenta('Startup'),
		'Config file shows "stable", searching for all production bots'
	)
} */

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
					name: `Production ${chalk.red(
						'(This will boot the bot to'
					)} ${chalk.red.underline('every')} ${chalk.red(
						'server!)'
					)}`,
				},
			],
		},
	])
	.then((answers) => {
		console.log(JSON.stringify(answers, null, '  '))
	})

// import('./fdVerification/index.js')
