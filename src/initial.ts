import chalk from 'chalk' // CLI Colors
import inquirer from 'inquirer' // Interactive CLI
import Discord from 'discord.js' // Discord API
import mongoose from 'mongoose' // Database
import * as dotenv from 'dotenv' // .env File
import kill from 'node:process'

// -------------------------------------------------------------------------------

chalk.level = 3 // Configuring Chalk
dotenv.config({ path: '.env' }) // Configuring Dotenv
export const timestamp = `${
  // Configure the timestamp constant
  new Date().getMonth() + 1
}-${new Date().getDate()}-${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
export const client = new Discord.Client({
  // Configure Main Bot Permissions
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildVoiceStates,
  ],
})
export const client2 = new Discord.Client({
  // Configure Secondary Bot Permissions
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
  ],
})
export const client3 = mongoose.connect(process.env.mongoDbUri!) // Configure Database Uri

// -------------------------------------------------------------------------------

console.log(
  chalk.white(timestamp),
  chalk.underline.magentaBright('Startup'),
  ' Booting & connecting to database...'
)
client.login(process.env.floofyHelperToken)
client.once('ready', () => {
  client2.login(process.env.fdVerificationToken)
  client2.once('ready', async () => {
    /*console.log(
			chalk.white(timestamp),
			chalk.underline.magentaBright('Startup'),
			chalk.greenBright(' Connected to database')
		)*/
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
      .then(answers => {
        if (answers === 'Development') {
          import('./index.js')
        } else if (answers === 'Production') {
          inquirer
            .prompt([
              {
                type: 'list',
                message: `Are you sure? ${chalk.red(
                  '(This will boot the bot to'
                )} ${chalk.red.underline('every')} ${chalk.redBright('server!)')}`,
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
            .then(answers => {
              if (answers.production === 'No') {
                console.log(chalk.yellowBright.bold('Killing instance, restart bot to deploy'))
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
                    client.login(process.env.floofyHelperToken)
                    client.once('shardReady', () => {
                      client2.login(process.env.fdVerificationToken)
                      client2.once('shardReady', () => {
                        import('./index.js')
                        console.log(
                          chalk.white(timestamp),
                          chalk.underline.magentaBright('Startup'),
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
