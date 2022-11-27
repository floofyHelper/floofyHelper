import Discord from 'discord.js'; // Discord API
import { REST } from '@discordjs/rest';
import { client } from './classes/client.js';
import Logger from './classes/logger.js';

// -------------------------------------------------------------------------------

// @ts-ignore
const deleteCommands = [];

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

const rest = new REST({ version: process.env.DISCORD_API_VERSION }).setToken(
  process.env.BOT_TOKEN!
);

rest
  .put(Discord.Routes.applicationCommands(process.env.BOT_APPLICATION_ID!), { body: commands })
  .then(() =>
    new Logger(`${client.user?.username}`).success('Successfully registered slash commands')
  )
  .catch(console.error);
