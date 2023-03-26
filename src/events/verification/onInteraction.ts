import Discord from 'discord.js';
import { PrismaClient } from '@prisma/client';

import Client from '../../classes/client.js';
import Components from '../../classes/components.js';

const prisma = new PrismaClient();

module.exports = {
  name: Discord.Events.InteractionCreate,
  async execute(interaction: Discord.Interaction) {
    /* Button Interactions */

    if (interaction.isButton()) {
      // Under 13
      if (interaction.customId.startsWith('verification1 1')) {
        Promise.all([
          interaction.deferReply(),
          interaction.message.delete(),
          interaction.client.guilds.fetch(`${interaction.customId.split(',').at(1)}`),
        ])
          .then(guild => {
            Promise.all([
              interaction.user.send({
                embeds: [Components.embed.verification.under13],
                components: [Components.button.verification.under13],
              }),
              interaction.deleteReply(),
            ]);
            return guild;
          })
          .then(async guild =>
            guild[2].members
              .kick(
                `${interaction.user.id}`,
                `User is under 13 | ${
                  (
                    await interaction.client.guilds.fetch(
                      `${interaction.customId.split(',').at(1)}`
                    )
                  ).name
                }`
              )
              .catch(async err => {
                await interaction.deleteReply();
                throw err;
              })
          );
        /*client.channels.fetch('2345342312').then(async channel => {
            if (channel.isTextBased()) {
              await channel.send({
              embeds: [Components.embed.verification.review(interaction, guildId)],
            });
            }
          });*/
      }

      // 13-15
      if (interaction.customId.startsWith('verification1 2')) {
        const Id = interaction.customId.split(',');
        Id.shift();
        Id.push(`1,${interaction.message.id}`);
        await interaction.showModal(Components.modal.verification[1](Id));
      }

      // 16-17
      if (interaction.customId.startsWith('verification1 3')) {
        const Id = interaction.customId.split(',');
        Id.shift();
        Id.push(`2,${interaction.message.id}`);
        await interaction.showModal(Components.modal.verification[1](Id));
      }

      // 18+
      if (interaction.customId.startsWith('verification1 4')) {
        const Id = interaction.customId.split(',');
        Id.shift();
        Id.push(`3,${interaction.message.id}`);
        await interaction.showModal(Components.modal.verification[1](Id));
      }

      // Submit Verification
      if (interaction.customId.startsWith('verification2 1')) {
        Promise.all([
          interaction.deferReply(),
          interaction.message.delete(),
          interaction.client.users
            .fetch(interaction.user.id)
            .then(async user => {
              const message = await user.dmChannel?.messages.fetch(
                `${interaction.customId.split(',').at(3)}`
              );
              return message;
            })
            .then(async message => await message?.delete()),
          prisma.guild.findUnique({ where: { id: interaction.customId.split(',').at(1) } }),
          prisma.guildVerification.findFirst({
            where: { id: interaction.user.id, guildId: interaction.customId.split(',').at(1) },
          }),
        ])
          .then(async db => {
            const channel = await interaction.client.channels.fetch(
              `${db[3]?.settings?.verification.verificationChannel}`
            );
            return { db, channel };
          })
          .then(async data => {
            if (!data.channel?.isTextBased()) return;
            await data.channel
              .send({
                embeds: [
                  Components.embed.verification.review[1](
                    interaction.user,
                    await interaction.client.guilds.fetch(
                      `${interaction.customId.split(',').at(1)}`
                    ),
                    data.db[4]?.age,
                    data.db[3]?.settings?.verification,
                    data.db[4]?.responses
                  ),
                ],
                components: [
                  Components.selectMenu.verification.review(interaction.user),
                  Components.button.verification.review[1](interaction.user),
                ],
              })
              .catch(async err => {
                await interaction.deleteReply();
                throw err;
              });
            return data;
          })
          .then(async data =>
            Promise.all([
              interaction.user
                .send({
                  embeds: [
                    Components.embed.verification[3](
                      await interaction.client.guilds.fetch(
                        `${interaction.customId.split(',').at(1)}`
                      ),
                      data?.db[4]?.age,
                      data?.db[3]?.settings?.verification,
                      data?.db[4]?.responses
                    ),
                  ],
                })
                .then(
                  async message =>
                    await prisma.guildVerification.updateMany({
                      where: {
                        id: interaction.user.id,
                        guildId: interaction.customId.split(',').at(1),
                      },
                      data: { messageId: message.id },
                    })
                ),
              interaction.deleteReply(),
            ])
          )
          .finally(() => prisma.$disconnect);
      }

      // Restart Verification
      if (interaction.customId.startsWith('verification2 2')) {
        await interaction.deferReply();
        const id = interaction.customId.split(',').at(1);
        const buttons = Components.button.verification[1](id);
        buttons.components.forEach(buttons =>
          buttons.setDisabled(false).setStyle(Discord.ButtonStyle.Secondary)
        );
        Promise.all([
          interaction.message.delete(),
          interaction.client.users.fetch(interaction.user.id),
        ])
          .then(async user => {
            const message = await user[1].dmChannel?.messages.fetch(
              `${interaction.customId.split(',').at(3)}`
            );
            return message;
          })
          .then(async message => await message?.delete())
          .then(async () =>
            Promise.all([
              interaction.user.send({
                embeds: [
                  Components.embed.verification[1](
                    interaction.user,
                    await interaction.client.guilds.fetch(`${id}`)
                  ),
                ],
                components: [buttons],
              }),
              interaction.deleteReply(),
            ])
          );
      }

      // Accept Verification Application
      if (interaction.customId.startsWith('verificationReview 1')) {
        Promise.all([interaction.deferReply({ ephemeral: true }), interaction.message.delete()])
          .then(() => interaction.client.users.fetch(`${interaction.customId.split(',').at(1)}`))
          .then(async user => {
            const guildMember = await interaction.guild?.members.fetch(user);
            const guild = await prisma.guild.findUnique({ where: { id: interaction.guild?.id } });
            const messageId = await prisma.guildVerification.findFirst({
              where: { id: interaction.customId.split(',').at(1), guildId: interaction.guild?.id },
              select: { messageId: true },
            });
            return { user, guildMember, guild, messageId };
          })
          .then(data => {
            data.guildMember?.roles.add(`${data.guild?.settings?.verification.role}`);
            return data;
          })
          .then(async data =>
            Promise.all([
              await data.user.dmChannel?.messages
                .fetch(`${data.messageId?.messageId}`)
                .then(async message => await message.delete()),
              data.user.send({
                embeds: [
                  Components.embed.verification.accept(
                    await interaction.client.guilds.fetch(`${interaction.guild?.id}`)
                  ),
                ],
              }),
              interaction.editReply('Succesfully verified user'),
            ])
          )
          .finally(() => {
            setTimeout(async () => await interaction.deleteReply(), 5000);
            prisma.$disconnect;
          });
      }

      // Deny Verification Application
      if (interaction.customId.startsWith('verificationReview 2')) {
        interaction.showModal(
          Components.modal.verification.deny(
            await interaction.client.users.fetch(`${interaction.customId.split(',').at(1)}`)
          )
        );
        await interaction.client.users
          .fetch(`${interaction.customId.split(',').at(1)}`)
          .then(async user => {
            const message = await prisma.guildVerification.findFirst({
              where: { id: interaction.customId.split(',').at(1), guildId: interaction.guild?.id },
              select: { messageId: true },
            });
            user.dmChannel?.messages
              .fetch(`${message?.messageId}`)
              .then(async message => await message.delete());
          });
      }

      // User ID for Verification Application
      if (interaction.customId.startsWith('verificationReviewButton1 3')) {
        interaction.reply({ content: `${interaction.customId.split(',').at(1)}`, ephemeral: true });
      }

      // Resend Verification After Denial
      if (interaction.customId.startsWith('verificationDeny 1')) {
        await interaction.deferReply();
        const buttons = Components.button.verification[1](interaction.customId.split(',').at(1));
        buttons.components.forEach(buttons =>
          buttons.setDisabled(false).setStyle(Discord.ButtonStyle.Secondary)
        );
        Promise.all([
          interaction.message.delete(),
          interaction.user.send({
            embeds: [
              Components.embed.verification[1](
                interaction.user,
                await interaction.client.guilds.fetch(`${interaction.customId.split(',').at(1)}`)
              ),
            ],
            components: [buttons],
          }),
          interaction.deleteReply(),
        ]);
      }

      if (interaction.customId === 'verificationHelp 1') {
        await interaction.deferUpdate();
        await interaction.showModal(Components.modal.ticket[1]);
      }

      if (interaction.customId === 'verificationHelp 2') {
        await interaction.deferUpdate();
        const buttons = Components.button.verification[1](interaction.guild?.id);
        buttons.components.forEach(buttons =>
          buttons.setDisabled(false).setStyle(Discord.ButtonStyle.Secondary)
        );
        if (interaction.guild?.name === undefined) {
        } else {
          await interaction.user.send({
            embeds: [Components.embed.verification[1](interaction.user, interaction.guild)],
            components: [buttons],
          });
        }
      }
    }

    /* Modal Interactions */

    if (interaction.isModalSubmit()) {
      if (interaction.customId.startsWith('verification1')) {
        const buttons = Components.button.verification[1]();
        const buttonId: number = Number(interaction.customId.split(',').at(2));
        Promise.all([
          interaction.deferUpdate(),
          buttons.components.forEach(buttons =>
            buttons.setDisabled(true).setStyle(Discord.ButtonStyle.Secondary)
          ),
          buttons.components[buttonId].setStyle(Discord.ButtonStyle.Primary),
        ]);
        if (interaction.isFromMessage()) await interaction.message.edit({ components: [buttons] });
        const id = interaction.customId.split(',');
        id.shift();
        let age: string | undefined = undefined;
        if (buttonId === 1) age = '13-15';
        if (buttonId === 2) age = '16-17';
        if (buttonId === 3) age = '18+';
        await prisma.guildVerification
          .findFirst({
            where: { id: interaction.user.id, guildId: interaction.customId.split(',').at(1) },
          })
          .then(async data => {
            if (data) {
              await prisma.guildVerification.updateMany({
                where: {
                  id: interaction.user.id,
                  guildId: `${interaction.customId.split(',').at(1)}`,
                },
                data: {
                  age: age,
                  responses: [
                    interaction.fields.getTextInputValue('verification1 1'),
                    interaction.fields.getTextInputValue('verification1 2'),
                    interaction.fields.getTextInputValue('verification1 3'),
                    interaction.fields.getTextInputValue('verification1 4'),
                    interaction.fields.getTextInputValue('verification1 5'),
                  ],
                },
              });
            } else {
              await prisma.guildVerification.create({
                data: {
                  id: interaction.user.id,
                  guildId: interaction.customId.split(',').at(1),
                  age: age,
                  responses: [
                    interaction.fields.getTextInputValue('verification1 1'),
                    interaction.fields.getTextInputValue('verification1 2'),
                    interaction.fields.getTextInputValue('verification1 3'),
                    interaction.fields.getTextInputValue('verification1 4'),
                    interaction.fields.getTextInputValue('verification1 5'),
                  ],
                },
              });
            }
          });
        Promise.all([
          interaction.user.send({
            embeds: [
              Components.embed.verification[2](
                interaction,
                await interaction.client.guilds.fetch(`${interaction.customId.split(',').at(1)}`)
              ),
            ],
            components: [Components.button.verification[2](id)],
          }),
        ]).finally(() => prisma.$disconnect);
      }

      if (interaction.customId.startsWith('verificationDeny')) {
        Promise.all([
          interaction.deferReply({ ephemeral: true }),
          interaction.message?.delete(),
          interaction.client.users
            .fetch(`${interaction.customId.split(',').at(1)}`)
            .then(async user =>
              user.send({
                embeds: [
                  Components.embed.verification.deny(
                    await interaction.client.guilds.fetch(`${interaction.guild?.id}`),
                    interaction.fields.getTextInputValue('verificationDeny 1')
                  ),
                ],
                components: [
                  Components.button.verification.deny(
                    await interaction.client.guilds.fetch(`${interaction.guild?.id}`)
                  ),
                ],
              })
            ),
        ])
          .then(() => interaction.editReply('Succesfully denied user'))
          .finally(() => setTimeout(async () => await interaction.deleteReply(), 5000));
      }
    }

    /* Select Menu Interactions */

    if (interaction.isStringSelectMenu()) {
      if (interaction.customId.startsWith('verificationReviewSelectMenu1 1')) {
        if (interaction.values[0] === 'menu 3') {
          Promise.all([
            interaction.deferReply({ ephemeral: true }),
            interaction.client.users.fetch(`${interaction.customId.split(',').at(1)}`),
            prisma.guildVerification.findUnique({
              where: { id: interaction.customId.split(',').at(1) },
            }),
          ]).then(data => {
            interaction.editReply({
              embeds: [Components.embed.verification.review[2](data[1], data[2])],
            });
          });
        }
        if (interaction.values[0] === 'menu 4') {
          interaction.deferUpdate();
          if (interaction.channel?.type !== Discord.ChannelType.GuildText) return;
          interaction.channel.threads
            .create({
              name: `Verification questioning for ${
                (await interaction.client.users.fetch(`${interaction.customId.split(',').at(1)}`))
                  .username
              }`,
              autoArchiveDuration: Discord.ThreadAutoArchiveDuration.OneHour,
              invitable: false,
              type: Discord.ChannelType.PrivateThread,
            })
            .then(async thread => {
              await thread.send('Test');
              thread.members.add(interaction.user);
              thread.parent
                ?.createWebhook({
                  name: `${
                    (
                      await interaction.client.users.fetch(
                        `${interaction.customId.split(',').at(1)}`
                      )
                    ).username
                  }`,
                  avatar: `${(
                    await interaction.client.users.fetch(`${interaction.customId.split(',').at(1)}`)
                  ).avatarURL()}`,
                })
                .then(webhook => webhook.send({ content: 'hi', threadId: thread.id }));
            });
        }
        if (interaction.values[0] === 'menu 5') {
          await interaction.deferReply({ ephemeral: true });
          interaction.client.users
            .fetch(`${interaction.customId.split(',').at(1)}`)
            .then(user => {
              if (user === undefined)
                throw (Client.errorCodes.notFound, 'Failed to request user data');
              let isButtonDisabled: boolean = true;
              console.log(user.bannerURL());
              if (user.bannerURL()) isButtonDisabled = false;
              return { user, isButtonDisabled };
            })
            .then(data =>
              interaction.editReply({
                components: [
                  Components.button.verification.review.reverseImageSearch(
                    data.user,
                    data.isButtonDisabled
                  ),
                ],
              })
            );
        }
      }
    }
  },
};
