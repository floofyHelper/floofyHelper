import Discord from 'discord.js';
import Prisma from '@prisma/client';

import Client from '../../classes/client';

export default class VerificationComponents {
  static embed = {
    1: (user: Discord.User, guild: Discord.Guild | null) =>
      new Discord.EmbedBuilder()
        .setAuthor({
          name: `Welcome ${user.username} to ${guild?.name}!`,
          iconURL: `${guild?.iconURL()}`,
        })
        .setDescription(
          `Before you can access the server, we need to ask some questions to make sure this server is a good fit for you. Whenever you're ready, please start below.
            
            ${Discord.blockQuote(
              `Please select your age group below to verify your account.
              ${Discord.bold('Lying about your age will result in a ban.')}`
            )}`
        ),

    2: (modal: Discord.ModalSubmitInteraction, guild: Discord.Guild) =>
      new Discord.EmbedBuilder()
        .setAuthor({
          name: 'Look over your application, want to change anything?',
          iconURL: `${guild.iconURL()}`,
        })
        .addFields(
          {
            name: 'How did you find us?',
            value: `${Discord.blockQuote(modal.fields.getTextInputValue('verification1 1'))}`,
          },
          {
            name: 'Why did you join our server?',
            value: `${Discord.blockQuote(modal.fields.getTextInputValue('verification1 2'))}`,
          },
          {
            name: 'Tell us a bit about yourself!',
            value: `${Discord.blockQuote(modal.fields.getTextInputValue('verification1 3'))}`,
          },
          {
            name: 'Have a fursona? Tell us about it!',
            value: `${Discord.blockQuote(modal.fields.getTextInputValue('verification1 4'))}`,
          },
          {
            name: 'Have you read the rules?',
            value: `${Discord.blockQuote(modal.fields.getTextInputValue('verification1 5'))}`,
          }
        ),

    3: (
      guild: Discord.Guild,
      age: string | null | undefined,
      questions: Prisma.guildSettingsVerification | undefined,
      answers: string[] | undefined
    ) =>
      new Discord.EmbedBuilder() //
        .setColor(Client.color.green)
        .setAuthor({
          name: `${guild.name} has recived your application!`,
          iconURL: Client.emojiUrl.check,
        })
        .setDescription(
          `${Discord.quote(
            `All verification applications are reviewed manually by our staff, so sometimes it can take a while. ${Discord.bold(
              'Usually, people are verified within 2 days.'
            )} Please don't ping staff/open tickets about verifying you.`
          )}`
        )
        .addFields(
          { name: `Age:`, value: `${Discord.quote(age!)}` },
          {
            name: `${questions?.questions.at(0)}`,
            value: `${Discord.blockQuote(answers?.at(0)!)}`,
          },
          {
            name: `${questions?.questions.at(1)}`,
            value: `${Discord.blockQuote(answers?.at(1)!)}`,
          },
          {
            name: `${questions?.questions.at(2)}`,
            value: `${Discord.blockQuote(answers?.at(2)!)}`,
          },
          {
            name: `${questions?.questions.at(3)}`,
            value: `${Discord.blockQuote(answers?.at(3)!)}`,
          },
          {
            name: `${questions?.questions.at(4)}`,
            value: `${Discord.blockQuote(answers?.at(4)!)}`,
          }
        ),

    under13: new Discord.EmbedBuilder() //
      .setColor(Client.color.red)
      .setAuthor({
        name: "As per Discord's ToS, you must be at least 13 years old to join this server.",
        iconURL: Client.emojiUrl.cross,
      }),

    help: (clientUser: Discord.ClientUser | null) =>
      new Discord.EmbedBuilder()
        .addFields(
          {
            name: 'How do I verify?',
            value: `> Check for a DM from <@${clientUser?.id}> and answer the questions provided.`,
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

    review: {
      1: (
        user: Discord.User,
        guild: Discord.Guild,
        age: string | null | undefined,
        questions: Prisma.guildSettingsVerification | undefined,
        answers: string[] | undefined
      ) =>
        new Discord.EmbedBuilder()
          .setAuthor({
            name: `Verification Application for ${user.username}`,
            iconURL: `${guild.iconURL()}`,
          })
          .addFields(
            {
              name: 'Account Age:',
              value: `${Discord.blockQuote(
                `${Discord.time(Math.round(user.createdTimestamp / 1000))}, ${Discord.time(
                  Math.round(user.createdTimestamp / 1000),
                  'R'
                )}`
              )}`,
            },
            {
              name: 'User Age:',
              value: `${Discord.blockQuote(`${age}`)}`,
            },
            /*{
              name: 'User Check:',
              value: `> ${userCheck1}\n> ${userCheck2}\n> ${userCheck3}`,
            },*/
            {
              name: `${questions?.questions.at(0)}`,
              value: `${Discord.blockQuote(answers?.at(0)!)}`,
            },
            {
              name: `${questions?.questions.at(1)}`,
              value: `${Discord.blockQuote(answers?.at(1)!)}`,
            },
            {
              name: `${questions?.questions.at(2)}`,
              value: `${Discord.blockQuote(answers?.at(2)!)}`,
            },
            {
              name: `${questions?.questions.at(3)}`,
              value: `${Discord.blockQuote(answers?.at(3)!)}`,
            },
            {
              name: `${questions?.questions.at(4)}`,
              value: `${Discord.blockQuote(answers?.at(4)!)}`,
            }
          )
          .setThumbnail(`${user.avatarURL()}?size=4096`),

      2: (user: Discord.User, data: Prisma.guildVerification | null) =>
        new Discord.EmbedBuilder() //
          .addFields({
            name: 'User Info:',
            value: `${Discord.blockQuote(
              `User Tag: ${Discord.userMention(user.id)}
          User ID: ${user.id}
          Account Age: ${Discord.time(Math.round(user.createdTimestamp / 1000))}, ${Discord.time(
                Math.round(user.createdTimestamp / 1000),
                'R'
              )}
          User Age: ${data?.age}`
            )}` /*\n> **Invite Link:** ${invite
          .split(',')
          .at(0)}\n> **Joined From:** ${invite.split(',').at(1)}`*/,
          }),
    },

    accept: (guild: Discord.Guild) =>
      new Discord.EmbedBuilder().setColor(Client.color.green).setAuthor({
        name: `You've been accepted into ${guild.name}!`,
        iconURL: `${guild.iconURL()}`,
      }),

    deny: (guild: Discord.Guild, reason: string) =>
      new Discord.EmbedBuilder()
        .setColor(Client.color.red)
        .setAuthor({
          name: `${guild.name} has denied your application`,
          iconURL: Client.emojiUrl.cross,
        })
        .setDescription(
          `${Discord.blockQuote(
            `Applications are usually rejected because the information provided wasn't sufficient to verify the user. You can try again by clicking the button below.`
          )}`
        )
        .addFields({ name: 'Deny reason:', value: Discord.blockQuote(reason) }),
  };

  static button = {
    1: (guildId?: Discord.GuildResolvable) =>
      new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
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

    2: (guildId: string[]) =>
      new Discord.ActionRowBuilder<Discord.ButtonBuilder>() //
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

    under13: new Discord.ActionRowBuilder<Discord.ButtonBuilder>() //
      .addComponents(
        new Discord.ButtonBuilder()
          .setLabel('Discord Age Requirements')
          .setURL('https://discord.com/terms#2')
          .setStyle(Discord.ButtonStyle.Link)
      ),

    help: new Discord.ActionRowBuilder<Discord.ButtonBuilder>() //
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

    review: {
      1: (user: Discord.User) =>
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId(`verificationReview 1,${user.id}`)
              .setLabel('Approve')
              .setStyle(Discord.ButtonStyle.Secondary)
          )
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId(`verificationReview 2,${user.id}`)
              .setLabel('Deny')
              .setStyle(Discord.ButtonStyle.Secondary)
          )
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId(`verificationReviewButton1 3,${user.id}`)
              .setLabel('User ID')
              .setStyle(Discord.ButtonStyle.Secondary)
          )
          .addComponents(
            new Discord.ButtonBuilder()
              .setLabel('User Profile')
              .setURL(`discord://-/users/${user.id}`)
              .setStyle(Discord.ButtonStyle.Link)
          ),

      reverseImageSearch: (user: Discord.User, isButtonDisabled: boolean) =>
        new Discord.ActionRowBuilder<Discord.ButtonBuilder>() //
          .addComponents(
            new Discord.ButtonBuilder()
              .setLabel('Avatar Reverse Image Search')
              .setURL(
                `https://lens.google.com/uploadbyurl?url=${user.avatarURL({
                  extension: 'webp',
                  size: 4096,
                })}`
              )
              .setStyle(Discord.ButtonStyle.Link)
          )
          .addComponents(
            new Discord.ButtonBuilder()
              .setLabel('Banner Reverse Image Search')
              .setURL(
                `https://lens.google.com/uploadbyurl?url=${user.bannerURL({
                  extension: 'webp',
                  size: 4096,
                })}`
              )
              .setStyle(Discord.ButtonStyle.Link)
              .setDisabled(isButtonDisabled)
          ),
    },

    deny: (guild: Discord.Guild) =>
      new Discord.ActionRowBuilder<Discord.ButtonBuilder>() //
        .addComponents(
          new Discord.ButtonBuilder()
            .setCustomId(`verificationDeny 1,${guild.id}`)
            .setLabel('Resend Verification')
            .setStyle(Discord.ButtonStyle.Secondary)
        ),

    test: new Discord.ActionRowBuilder<Discord.ButtonBuilder>() //
      .addComponents(
        new Discord.ButtonBuilder()
          .setCustomId('verificationDeny 1')
          .setLabel('Cancel verification denial')
          .setStyle(Discord.ButtonStyle.Secondary)
      ),
  };

  static modal = {
    1: (Id: string[]) =>
      new Discord.ModalBuilder()
        .setCustomId(`verification1,${Id}`)
        .setTitle('Verification Application')
        .addComponents(
          new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(
            new Discord.TextInputBuilder()
              .setCustomId('verification1 1')
              .setLabel('How did you find us?')
              .setPlaceholder('Ex. I found your server on Disboard')
              .setStyle(Discord.TextInputStyle.Short)
              .setMaxLength(50)
          ),
          new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(
            new Discord.TextInputBuilder()
              .setCustomId('verification1 2')
              .setLabel('Why did you join our server?')
              .setPlaceholder(
                'Ex. I want to join your server so I can socialize with a thriving community'
              )
              .setStyle(Discord.TextInputStyle.Paragraph)
              .setMaxLength(1020)
          ),
          new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(
            new Discord.TextInputBuilder()
              .setCustomId('verification1 3')
              .setLabel('Tell us a bit about yourself!')
              .setPlaceholder(
                'Tell us about your hobbies, interests, and anything else you want to share with us'
              )
              .setStyle(Discord.TextInputStyle.Paragraph)
              .setMaxLength(1020)
          ),
          new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(
            new Discord.TextInputBuilder()
              .setCustomId('verification1 4')
              .setLabel('Have a fursona? Tell us about it!')
              .setPlaceholder('What species is it? Have a ref? ')
              .setStyle(Discord.TextInputStyle.Paragraph)
              .setRequired(false)
              .setMaxLength(1020)
          ),
          new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(
            new Discord.TextInputBuilder()
              .setCustomId('verification1 5')
              .setLabel('Have you read the rules?')
              .setStyle(Discord.TextInputStyle.Short)
              .setMaxLength(3)
          )
        ),

    deny: (user: Discord.User) =>
      new Discord.ModalBuilder()
        .setCustomId(`verificationDeny,${user.id}`)
        .setTitle('Deny Verification')
        .addComponents(
          new Discord.ActionRowBuilder<Discord.ModalActionRowComponentBuilder>().addComponents(
            new Discord.TextInputBuilder()
              .setCustomId('verificationDeny 1')
              .setLabel('Deny reason')
              .setStyle(Discord.TextInputStyle.Paragraph)
              .setRequired(true)
              .setMaxLength(1020)
          )
        ),
  };

  static selectMenu = {
    review: (user: Discord.User) =>
      new Discord.ActionRowBuilder<Discord.StringSelectMenuBuilder>() //
        .addComponents(
          new Discord.StringSelectMenuBuilder()
            .setCustomId(`verificationReviewSelectMenu1 1,${user.id}`)
            .setPlaceholder('Additional Options')
            .addOptions(
              {
                label: 'Kick user',
                description: 'Removes the user from the server',
                value: 'menu 1',
              },
              {
                label: 'Ban user',
                description: 'Kicks the user and prevents them from rejoining',
                value: 'menu 2',
              },
              {
                label: 'User info',
                description: 'Extra info of the user',
                value: 'menu 3',
              },
              {
                label: 'Question',
                description: 'Creates a thread with the user for questioning',
                value: 'menu 4',
              },
              {
                label: 'Reverse image search',
                description: "Find if the user's avatar & banner are original",
                value: 'menu 5',
              }
            )
        ),
  };
}
