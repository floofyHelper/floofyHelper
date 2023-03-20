import Discord from 'discord.js';
import path from 'path';
import fs from 'fs';

import Logger from './logger.js';

export let client: DiscordClient;

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
    client = new DiscordClient();
    await client.login(this.token);
    client.once('ready', async () => {
      await import('../deployCommands.js');
      // Event handling
      const eventsPath = path.join(__dirname, '../events');
      const eventFiles: string[] = [];
      const readDir = (dir: string) => {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          if (fs.statSync(filePath).isDirectory()) {
            readDir(filePath);
          } else if (path.extname(file) === '.js') {
            eventFiles.push(filePath);
          }
        }
      };
      readDir(eventsPath);
      for (const file of eventFiles) {
        const event = require(file);
        if (event.once) {
          client.once(event.name, (...args) => event.execute(...args, this));
        } else {
          client.on(event.name, (...args) => event.execute(...args, this));
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

  static emojiId = {
    check: '1048303890283634688',
    undecided: '1048303887985168437',
    cross: '1048303889172135966',
    blank: '1049392956601270313',
    reply: '1048464060414435468',
  };

  static emoji = {
    check: Discord.formatEmoji(this.emojiId.check),
    undecided: Discord.formatEmoji(this.emojiId.undecided),
    cross: Discord.formatEmoji(this.emojiId.cross),
    blank: Discord.formatEmoji(this.emojiId.blank),
    reply: Discord.formatEmoji(this.emojiId.reply),
  };

  static emojiUrl = {
    check: `https://cdn.discordapp.com/emojis/1048303890283634688.webp?size=96&quality=lossless`,
    undecided:
      'https://cdn.discordapp.com/emojis/1048303887985168437.webp?size=96&quality=lossless',
    cross: 'https://cdn.discordapp.com/emojis/1048303889172135966.webp?size=96&quality=lossless',
    test: `https://cdn.discordapp.com/emojis/${this.emoji}.webp?size=96&quality=lossless`,
  };

  static color = {
    green: 0x69d09a,
    red: 0xeb716f,
  } as const;

  get inviteUrl() {
    return `https://discord.com/oauth2/authorize?client_id=${this.id}&permissions=19456&scope=bot%20applications.commands`;
  }

  static errorCodes = {
    badRequest: '400',
    notFound: '404',
    requestTimeout: '408',
    tooManyRequests: '429',
    badGateway: '502',
    gatewayTimeout: '504',
  };
}

class DiscordClient extends Discord.Client {
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
