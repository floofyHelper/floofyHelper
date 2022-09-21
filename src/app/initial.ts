import chalk from 'chalk'
import fs from 'node:fs' // File System
import yaml from 'js-yaml' // .yaml File
import * as dotenv from 'dotenv'
dotenv.config() // .env File

chalk.level = 3 // Configuring Chalk
const client = yaml.load(fs.readFileSync('../config/config.yml', 'utf8')) // Import The config.yaml File

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

import('./fdVerification/index.js')
