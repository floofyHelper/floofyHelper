import chalk from 'chalk'
import inquirer from 'inquirer'
import fs from 'node:fs' // File System
import yaml from 'js-yaml' // .yaml File
import * as dotenv from 'dotenv'
import { err } from '@sapphire/framework'
//dotenv.config() // .env File

chalk.level = 3 // Configuring Chalk
const client = yaml.load(fs.readFileSync('src/config/config.yml', 'utf8')) // Import The config.yaml File

export const timestamp = `${
	new Date().getMonth() + 1
}-${new Date().getDate()}-${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`

// -------------------------------------------------------------------------------

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
			dotenv.config({ path: '.env' })
			import('./fdVerification/index.js')
		} else if (answers.environment === 'Production') {
			inquirer
				.prompt([
					{
						type: 'list',
						message: `Are you sure? ${chalk.red(
							'(This will boot the bot to'
						)} ${chalk.red.underline('every')} ${chalk.red(
							'server!)'
						)}`,
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
					if (answers.production === 'Yes') {
						dotenv.config({ path: '.env.production' })
						import('./fdVerification/index.js')
					}
				})
		}
	})
