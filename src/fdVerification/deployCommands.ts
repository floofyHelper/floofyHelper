import chalk from 'chalk';
import Discord from 'discord.js'; // Discord API
import { REST } from '@discordjs/rest';
import { timestamp, config as client } from '../initial.js';

// -------------------------------------------------------------------------------

const deleteSlashCommands: unknown = [];

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

const rest = new REST({ version: config.discordAPIVersion }).setToken(
  process.env.fdVerificationToken!
);

rest
  .put(Discord.Routes.applicationCommands(process.env.fdVerificationClientID!), { body: commands })
  .then(() =>
    console.log(
      chalk.white(timestamp),
      chalk.underline.blueBright(client.user?.username),
      chalk.greenBright(' Successfully registered slash commands')
    )
  )
  .catch(console.error);
