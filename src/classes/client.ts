import Discord, { ButtonBuilder, ModalActionRowComponentBuilder } from 'discord.js';

import Database from './database.js';

export let client: FH;
export let db: Database;

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
    // Database
    db = new Database();

    // Discord gateway
    client = new FH();
    await client.login(process.env.BOT_TOKEN);
    client.once('ready', async () => {
      await import('../bot.js');
    });
  }

  static emoji = {
    check: '<:Check:1015719865572667625>',
    undecided: '<:Undecided:1015720206271787148>',
    cross: '<:Cross:1015719863446151198>',
  };

  static color = {
    green: 0x69d09a,
    red: 0xeb716f,
  } as const;

  get inviteUrl() {
    return `https://discord.com/oauth2/authorize?client_id=${this.id}&permissions=19456&scope=bot%20applications.commands`;
  }

  static embed = {
    error: new Discord.EmbedBuilder() //
      .setColor(0xeb716f)
      .setAuthor({
        name: 'Something went wrong!',
        iconURL:
          'https://cdn.discordapp.com/emojis/1015719863446151198.webp?size=240&quality=lossless',
      }),

    errorLog: (errorReason: any) =>
      new Discord.EmbedBuilder() //
        .setColor(0xeb716f)
        .setAuthor({
          name: 'Floofy Helper has had an error!',
          iconURL:
            'https://cdn.discordapp.com/emojis/1015719863446151198.webp?size=240&quality=lossless',
        })
        .setDescription(
          `> [<:status:975961724844924998> **Server Dashboard**](https://panel.wepwawet.net/server/bace9647)\n> [<:database:1033062779353051167> **MongoDB Atlas**](https://cloud.mongodb.com/v2/635185f826f2024f64a1ec28#clusters)\n> [<:github:1033062780372271104> **Github Repo**](https://github.com/floofyHelper)\n\`\`\`ts\n${errorReason}\`\`\``
        )
        .setTimestamp(),

    verification: {
      1: (interaction: any, interaction2: any) =>
        new Discord.EmbedBuilder()
          .setAuthor({
            name: `Welcome ${interaction.username} to ${interaction2.name}!`,
            iconURL: `${interaction2.iconURL()}`,
          })
          .setDescription(
            "Before you can access the server, we need you to answer some questions to make sure this server is a good fit for you. Whenever you're ready, please start below. \n \n > Please select your age group below to verify your account. \n > **Lying about your age will result in a ban.**"
          ),

      2: (interaction: any, guildIcon: any) =>
        new Discord.EmbedBuilder()
          .setAuthor({
            name: 'Look over your application, want to change anything?',
            iconURL: `${guildIcon}`,
          })
          .addFields(
            {
              name: 'How did you find us?',
              value: `> ${interaction.fields.getTextInputValue('verification1 1')}`,
            },
            {
              name: 'Why did you join our server?',
              value: `> ${interaction.fields.getTextInputValue('verification1 2')}`,
            },
            {
              name: 'Tell us a bit about yourself!',
              value: `> ${interaction.fields.getTextInputValue('verification1 3')}`,
            },
            {
              name: 'Have a fursona? Tell us about it!',
              value: `> ${interaction.fields.getTextInputValue('verification1 4')}`,
            },
            {
              name: 'Have you read the rules?',
              value: `> ${interaction.fields.getTextInputValue('verification1 5')}`,
            }
          ),

      3: (age: any, answer1: any, answer2: any, answer3: any, answer4: any, answer5: any) =>
        new Discord.EmbedBuilder() //
          .setColor(0x69d09a)
          .setAuthor({
            name: 'Verification application sent!',
            iconURL:
              'https://cdn.discordapp.com/emojis/1015719865572667625.webp?size=96&quality=lossless',
          })
          .setDescription(
            "> All verification applications are reviewed manually by our staff, so sometimes it can take a while. **Usually, people are verified within 2 days.** *Please don't ping staff/open tickets about verifying you.*"
          )
          .addFields(
            {
              name: 'Age:',
              value: `> ${age}`,
            },
            {
              name: 'How did you find us?',
              value: `> ${answer1}`,
            },
            {
              name: 'Why did you join our server?',
              value: `> ${answer2}`,
            },
            {
              name: 'Tell us a bit about yourself!',
              value: `> ${answer3}`,
            },
            {
              name: 'Have a fursona? Tell us about it!',
              value: `> ${answer4}`,
            },
            {
              name: 'Have you read the rules?',
              value: `> ${answer5}`,
            }
          ),

      under13: new Discord.EmbedBuilder() //
        .setColor(0xeb716f)
        .setAuthor({
          name: "As per Discord's ToS, you must be at least 13 years old to join this server.",
          iconURL:
            'https://cdn.discordapp.com/emojis/1015719863446151198.webp?size=240&quality=lossless',
        }),

      help: (client: any) =>
        new Discord.EmbedBuilder()
          .addFields(
            {
              name: 'How do I verify?',
              value: `> Check for a DM from <@${client.user.id}> and answer the questions provided.`,
            },
            {
              name: "Why haven't I been verified yet?",
              value:
                "> All verification applications are reviewed manually by our staff, so sometimes it can take a while. **Usually, people are verified within 2 days**. *Please don't ping staff/open tickets about verifying you.*",
            },
            {
              name: "Didn't receive a DM?",
              value:
                '> Make sure your DM\'s are open. Info on how to do so [here](https://support.discord.com/hc/en-us/articles/217916488-Blocking-Privacy-Settings-). \n > After you open up your DM\'s, click the "Resend Verification" button.',
            }
          )
          .setFooter({
            text: 'If you\'re encountering any issues that can\'t be solved above, click the "Open a Ticket" button to talk with staff.',
          }),

      review: (
        interaction: any,
        guildID: string,
        status: string,
        _age: string,
        _invite: string,
        userCheck1: string,
        userCheck2: string,
        userCheck3: string,
        _response1: string,
        _response2: string,
        _response3: string,
        _response4: string,
        _response5: string
      ) =>
        new Discord.EmbedBuilder()
          .setColor(0xeb716f)
          .setAuthor({
            name: `Verification Application${status}`,
            iconURL: `${interaction.client.guilds.cache.get(guildID)?.iconURL()}`,
          })
          .addFields(
            {
              name: 'User Info:',
              value: `> **User Tag:** <@${interaction.user.id}>\n> **User ID:** ||${
                interaction.user.id
              }||\n> **Account Age:** <t:${Math.round(
                interaction.user.createdTimestamp / 1000
              )}:f>, <t:${Math.round(
                interaction.user.createdTimestamp / 1000
              )}:R>` /*`\n> **User Age:** ${age}\n> **Invite Link:** ${invite
						.split(',')
						.at(0)}\n> **Joined From:** ${invite.split(',').at(1)}`*/,
            },
            {
              name: 'User Check:',
              value: `> ${userCheck1}\n> ${userCheck2}\n> ${userCheck3}`,
            },
            {
              name: 'Reason:',
              value: `> User is under 13 (Banned at verification) | ${
                interaction.client.guilds.cache.get(guildID)?.name
              }`,
            }
          )
          .setThumbnail(`${interaction.user.avatarURL()}?size=4096`)
          .setTimestamp(),
    },
  };

  static button = {
    error: new Discord.ActionRowBuilder<ButtonBuilder>() //
      .addComponents(
        new Discord.ButtonBuilder()
          .setLabel('Support Server')
          .setURL('https://discord.gg/hRmjAUvrpT')
          .setStyle(Discord.ButtonStyle.Link)
      ),

    verification: {
      1: (guildId?: any) =>
        new Discord.ActionRowBuilder<ButtonBuilder>()
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId(`verification1 1,${guildId}`)
              .setLabel('Under 13')
              .setStyle(Discord.ButtonStyle.Secondary)
          )
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId(`verification1 2,${guildId}`)
              .setLabel('13-15')
              .setStyle(Discord.ButtonStyle.Secondary)
          )
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId(`verification1 3,${guildId}`)
              .setLabel('16-17')
              .setStyle(Discord.ButtonStyle.Secondary)
          )
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId(`verification1 4,${guildId}`)
              .setLabel('18+')
              .setStyle(Discord.ButtonStyle.Secondary)
          ),

      2: (guildId: any) =>
        new Discord.ActionRowBuilder<ButtonBuilder>() //
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId(`verification2 1,${guildId}`)
              .setLabel('Submit')
              .setStyle(Discord.ButtonStyle.Secondary)
          )
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId(`verification2 2,${guildId}`)
              .setLabel('Restart')
              .setStyle(Discord.ButtonStyle.Secondary)
          ),

      under13: new Discord.ActionRowBuilder<ButtonBuilder>() //
        .addComponents(
          new Discord.ButtonBuilder()
            .setLabel('Discord Age Requirements')
            .setURL('https://discord.com/terms#2')
            .setStyle(Discord.ButtonStyle.Link)
        ),

      help: new Discord.ActionRowBuilder<ButtonBuilder>() //
        .addComponents(
          new Discord.ButtonBuilder()
            .setCustomId('verificationHelp 1')
            .setLabel('Open a Ticket')
            .setStyle(Discord.ButtonStyle.Primary)
            .setEmoji('🎟️')
        )
        .addComponents(
          new Discord.ButtonBuilder()
            .setCustomId('verificationHelp 2')
            .setLabel('Resend Verification')
            .setStyle(Discord.ButtonStyle.Secondary)
            .setEmoji('📨')
        ),

      review: new Discord.ActionRowBuilder<ButtonBuilder>() //
        .addComponents(
          new Discord.ButtonBuilder()
            .setCustomId('verificationReview 1')
            .setLabel('Approve')
            .setStyle(Discord.ButtonStyle.Success)
        )
        .addComponents(
          new Discord.ButtonBuilder()
            .setCustomId('verificationReview 2')
            .setLabel('Deny')
            .setStyle(Discord.ButtonStyle.Danger)
        )
        .addComponents(
          new Discord.ButtonBuilder()
            .setCustomId('verificationReview 3')
            .setLabel('Question')
            .setStyle(Discord.ButtonStyle.Secondary)
        )
        .addComponents(
          new Discord.ButtonBuilder()
            .setCustomId('verificationReview 4')
            .setLabel('More Options')
            .setStyle(Discord.ButtonStyle.Secondary)
        ),
    },
  };

  static modal = {
    verification: {
      1: (Id: any) =>
        new Discord.ModalBuilder()
          .setCustomId(`verification1,${Id}`)
          .setTitle('Verification Application')
          .addComponents(
            new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
              new Discord.TextInputBuilder()
                .setCustomId('verification1 1')
                .setLabel('How did you find us?')
                .setPlaceholder('Ex. I found your server on Disboard')
                .setStyle(Discord.TextInputStyle.Short)
                .setMaxLength(50)
            ),
            new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
              new Discord.TextInputBuilder()
                .setCustomId('verification1 2')
                .setLabel('Why did you join our server?')
                .setPlaceholder(
                  'Ex. I want to join your server so I can socialize with a thriving community'
                )
                .setStyle(Discord.TextInputStyle.Paragraph)
                .setMaxLength(1024)
            ),
            new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
              new Discord.TextInputBuilder()
                .setCustomId('verification1 3')
                .setLabel('Tell us a bit about yourself!')
                .setPlaceholder(
                  'Tell us about your hobbies, interests, and anything else you want to share with us'
                )
                .setStyle(Discord.TextInputStyle.Paragraph)
                .setMaxLength(1024)
            ),
            new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
              new Discord.TextInputBuilder()
                .setCustomId('verification1 4')
                .setLabel('Have a fursona? Tell us about it!')
                .setPlaceholder('What species is it? Have a ref? ')
                .setStyle(Discord.TextInputStyle.Paragraph)
                .setRequired(false)
                .setMaxLength(1024)
            ),
            new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
              new Discord.TextInputBuilder()
                .setCustomId('verification1 5')
                .setLabel('Have you read the rules?')
                .setStyle(Discord.TextInputStyle.Short)
                .setMaxLength(3)
            )
          ),
    },

    ticket: {
      1: new Discord.ModalBuilder()
        .setCustomId('ticket')
        .setTitle('Open a Ticket')
        .addComponents(
          new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
            new Discord.TextInputBuilder()
              .setCustomId('ticket1 1')
              .setLabel('What is the reason for this support ticket?')
              .setPlaceholder("Ex. I'm having issues sending images in media")
              .setStyle(Discord.TextInputStyle.Paragraph)
              .setMaxLength(1024)
          )
        ),
    },
  };

  static selectMenu = {};

  static webhook = {};
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
      presence: {
        activities: [{ name: '/help • Floofy Helper', type: Discord.ActivityType.Listening }],
        status: 'online',
      },
      allowedMentions: {
        repliedUser: false,
      },
    });
  }
}
