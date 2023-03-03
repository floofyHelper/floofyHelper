import Discord from 'discord.js';
import fs from 'fs';
import path from 'path';

import Logger from './logger.js';

export let client: FH;

export default class Client {
  id: string;
  publicKey: string;
  token: string;
  discordApiUrl: string;

  constructor({
    applicationId,
    publicKey,
    token,
  }: {
    applicationId: string;
    publicKey: string;
    token: string;
  }) {
    this.id = applicationId;
    this.publicKey = publicKey;
    this.token = token;
    this.discordApiUrl = process.env.DISCORD_API_VERSION || 'https://discord.com';
  }

  async start() {
    // Discord gateway
    client = new FH();
    await client.login(this.token);
    client.once('ready', async () => {
      await import('../deployCommands.js');
      // Event handling
      const eventsPath = path.join(__dirname, '../events', '../events/verification');
      const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
      for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args));
        } else {
          client.on(event.name, (...args) => event.execute(...args));
        }
      }
      // Command handling
      /*client.commands = new Collection();
      const commandsPath = path.join(__dirname, '../commands');
      const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
      for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        client.commands.set(command.data.name, command);
      }
      client.on(Discord.Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;
        const command = client.commands.get(interaction.commandName);
        if (!command) return;
        try {
          await command.execute(interaction);
        } catch (error) {
          console.error(error);
          await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true,
          });
        }
      });*/

      new Logger(`${client.user?.username}`).success(`${client.user?.tag} is logged in`);
    });
  }

  static emoji = {
    check: Discord.formatEmoji('1048303890283634688'),
    undecided: Discord.formatEmoji('1048303887985168437'),
    cross: Discord.formatEmoji('1048303889172135966'),
    blank: Discord.formatEmoji('1049392956601270313'),
    reply: Discord.formatEmoji('1048464060414435468'),
  };

  static emojiUrl = {
    check: `https://cdn.discordapp.com/emojis/1048303890283634688.webp?size=96&quality=lossless`,
    undecided:
      'https://cdn.discordapp.com/emojis/1048303887985168437.webp?size=96&quality=lossless',
    cross: 'https://cdn.discordapp.com/emojis/1048303889172135966.webp?size=96&quality=lossless',
  };

  static color = {
    green: 0x69d09a,
    red: 0xeb716f,
  } as const;

  get inviteUrl() {
    return `https://discord.com/oauth2/authorize?client_id=${this.id}&permissions=19456&scope=bot%20applications.commands`;
  }

  static errorCodes = {
    badRequest: 400,
    notFound: 404,
    requestTimeout: 408,
    tooManyRequests: 429,
    badGateway: 502,
    gatewayTimeout: 504,
  };
}

class FH extends Discord.Client {
  constructor() {
    super({
      intents: [
        Discord.GatewayIntentBits.Guilds,
        Discord.GatewayIntentBits.GuildMembers,
        Discord.GatewayIntentBits.GuildMessages,
        Discord.GatewayIntentBits.GuildVoiceStates,
      ],
      allowedMentions: {
        repliedUser: false,
      },
      partials: [Discord.Partials.Channel, Discord.Partials.Message],
    });
  }
}
