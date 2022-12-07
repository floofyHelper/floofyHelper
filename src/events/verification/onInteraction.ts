import Discord from 'discord.js';
import { PrismaClient } from '@prisma/client';

import { client } from '../../classes/client.js';
import Components from '../../classes/components.js';
import * as functions from '../../classes/functions.js';

const prisma = new PrismaClient();

module.exports = {
  name: Discord.Events.InteractionCreate,
  async execute(interaction: Discord.Interaction) {
    if (interaction.isButton()) {
      try {
        if (interaction.customId.startsWith('verification1 1')) {
          await interaction.deferUpdate();
          await interaction.message.delete();
          await interaction.user.send({
            embeds: [Components.embed.verification.under13],
            components: [Components.button.verification.under13],
          });
          const guildId = interaction.customId.split(',').at(1);
          await interaction.client.guilds.fetch(guildId!).then(async guild => {
            guild.members.kick(
              `${interaction.user.id}`,
              `User is under 13 | ${(await interaction.client.guilds.fetch(guildId!)).name}`
            );
          });
          /*client.channels.fetch('2345342312').then(async channel => {
            if (channel.isTextBased()) {
              await channel.send({
              embeds: [Components.embed.verification.review(interaction, guildId)],
            });
            }
          });*/
        }

        if (interaction.customId.startsWith('verification1 2')) {
          const Id = interaction.customId.split(',');
          Id.shift();
          Id.push(`1,${interaction.message.id}`);
          await interaction.showModal(Components.modal.verification[1](Id));
        }

        if (interaction.customId.startsWith('verification1 3')) {
          const Id = interaction.customId.split(',');
          Id.shift();
          Id.push(`2,${interaction.message.id}`);
          await interaction.showModal(Components.modal.verification[1](Id));
        }

        if (interaction.customId.startsWith('verification1 4')) {
          const Id = interaction.customId.split(',');
          Id.shift();
          Id.push(`3,${interaction.message.id}`);
          await interaction.showModal(Components.modal.verification[1](Id));
        }

        if (interaction.customId.startsWith('verification2 1')) {
          await interaction.deferReply();
          await interaction.message.delete();
          await client.users.fetch(interaction.user.id).then(async user => {
            await user.dmChannel?.messages
              .fetch(interaction.customId.split(',').at(3)!)
              .then(async message => {
                await message.delete();
              });
          });
          await prisma.guildVerification
            .findUnique({
              where: {
                id: interaction.user.id,
              },
            })
            .then(async user => {
              const answers: string[] = [];
              user?.submissions.forEach(answer => {
                answers.push(answer);
              });
              await prisma.guild
                .findUnique({
                  where: { id: interaction.customId.split(',').at(1) },
                  select: { settings: { select: { verification: {} } } },
                })
                .then(async guild => {
                  const questions: string[] = [];
                  guild?.settings?.verification.questions.forEach(question => {
                    questions.push(question);
                  });
                  await client.channels
                    .fetch(guild?.settings?.verification.channel!)
                    .then(async channel => {
                      if (channel?.isTextBased()) {
                        await channel.send({
                          embeds: [
                            Components.embed.verification.review(
                              interaction.user,
                              await client.guilds.fetch(interaction.customId.split(',').at(1)!),
                              user?.age,
                              questions,
                              answers
                            ),
                          ],
                          components: [Components.button.verification.review],
                        });
                      }
                      await interaction.user
                        .send({
                          embeds: [
                            Components.embed.verification[3](
                              await client.guilds.fetch(interaction.customId.split(',').at(1)!),
                              user?.age,
                              questions,
                              answers
                            ),
                          ],
                        })
                        .then(() => {
                          interaction.deleteReply();
                        });
                    });
                });
            })
            .finally(() => {
              prisma.$disconnect;
            });
        }

        if (interaction.customId.startsWith('verification2 2')) {
          await interaction.deferUpdate();
          const id = interaction.customId.split(',').at(1);
          const buttons = Components.button.verification[1](id);
          buttons.components.forEach(buttons => {
            buttons.setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
          });
          await interaction.message.delete();
          await client.users.fetch(interaction.user.id).then(async user => {
            await user.dmChannel?.messages
              .fetch(interaction.customId.split(',').at(3)!)
              .then(async message => {
                await message.delete();
              });
          });
          await interaction.user.send({
            embeds: [
              Components.embed.verification[1](interaction.user, await client.guilds.fetch(id!)),
            ],
            components: [buttons],
          });
        }

        if (interaction.customId === 'verificationHelp 1') {
          await interaction.deferUpdate();
          await interaction.showModal(Components.modal.ticket[1]);
        }

        if (interaction.customId === 'verificationHelp 2') {
          await interaction.deferUpdate();
          const buttons = Components.button.verification[1](interaction.guild?.id);
          buttons.components.forEach(buttons => {
            buttons.setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
          });
          if (interaction.guild?.name === undefined) {
          } else {
            await interaction.user.send({
              embeds: [Components.embed.verification[1](interaction.user, interaction.guild)],
              components: [buttons],
            });
          }
        }
      } catch (err) {
        await functions.sendToErrorLog(err, interaction);
      }
    }

    if (interaction.type == Discord.InteractionType.ModalSubmit) {
      try {
        if (interaction.customId.startsWith('verification1')) {
          await interaction.deferReply();
          const buttons = Components.button.verification[1]();
          buttons.components.forEach(buttons => {
            buttons.setDisabled(true).setStyle(Discord.ButtonStyle.Secondary);
          });
          const buttonId: number = Number(interaction.customId.split(',').at(2));
          buttons.components[buttonId].setStyle(Discord.ButtonStyle.Primary);
          if (interaction.isFromMessage()) {
            await interaction.message.edit({
              components: [buttons],
            });
          }
          let age: string | undefined = undefined;
          if (buttonId === 1) age = '13-15';
          if (buttonId === 2) age = '16-17';
          if (buttonId === 3) age = '18+';
          // Sending modal submissions to database
          await prisma.guild
            .update({
              where: { id: interaction.customId.split(',').at(1) },
              data: {
                verification: {
                  update: {
                    where: { id: interaction.user.id },
                    data: {
                      age: age,
                      submissions: [
                        interaction.fields.getTextInputValue('verification1 1'),
                        interaction.fields.getTextInputValue('verification1 2'),
                        interaction.fields.getTextInputValue('verification1 3'),
                        interaction.fields.getTextInputValue('verification1 4'),
                        interaction.fields.getTextInputValue('verification1 5'),
                      ],
                    },
                  },
                },
              },
            })
            .finally(() => {
              prisma.$disconnect;
            });
          const id = interaction.customId.split(',');
          id.shift();
          await interaction.user
            .send({
              embeds: [
                Components.embed.verification[2](
                  interaction,
                  await client.guilds.fetch(interaction.customId.split(',').at(1)!)
                ),
              ],
              components: [Components.button.verification[2](id)],
            })
            .then(() => {
              interaction.deleteReply();
            });
        }
      } catch (err) {
        await functions.sendToErrorLog(err, interaction);
      }
    }
  },
};
