import chalk from 'chalk'
import fs from 'node:fs' // File System
import yaml from 'js-yaml' // .yaml File
import * as dotenv from 'dotenv'
dotenv.config() // .env File

chalk.enabled = true
chalk.level = 3 // Configuring Chalk
// const client = yaml.load(fs.readFileSync('../config/config.yml')) // Import The config.yaml File

const timestamp = `${
	new Date().getMonth() + 1
}-${new Date().getDate()}-${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`

// -------------------------------------------------------------------------------

console.log(
	chalk.white(timestamp),
	chalk.underline.magenta('Startup'),
	chalk.magenta()
)

console.log('ready')
