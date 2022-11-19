import chalk from 'chalk';
import Discord from 'discord.js'; // Discord API
import { REST } from '@discordjs/rest';
import { timestamp, client } from './initial.js';

const { BOT_TOKEN, DISCORD_API_VERSION } = process.env;

// -------------------------------------------------------------------------------

const commands = [
  new Discord.SlashCommandBuilder()
    /* Staff / Commands */
    .setName('staff')
    .setDescription('All staff commands for verification')
    .setDMPermission(false)
    .addSubcommandGroup(subcommandGroup =>
      subcommandGroup
        .setName('verification')
        .setDescription('Verification commands')
        .addSubcommand(subcommand =>
          subcommand
            .setName('resend')
            .setDescription('Resend verification to a user')
            .addUserOption(option =>
              option
                .setName('user')
                .setDescription('The user you want to resend the verification application to')
                .setRequired(true)
            )
        )
    ),

  new Discord.SlashCommandBuilder()
    .setName('help')
    .setDescription('Having issues with verification?')
    .setDMPermission(false),
];

const rest = new REST({ version: DISCORD_API_VERSION }).setToken(BOT_TOKEN);

rest
  .put(Discord.Routes.applicationCommands(client.user.id), { body: commands })
  .then(() =>
    console.log(
      chalk.white(timestamp()),
      chalk.underline.blueBright(client.user?.username),
      chalk.greenBright(' Successfully registered slash commands')
    )
  )
  .catch(console.error);
