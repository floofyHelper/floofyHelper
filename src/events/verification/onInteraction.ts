import Discord from 'discord.js';
import { PrismaClient } from '@prisma/client';

import { client } from '../../classes/client.js';
import Components from '../../classes/components.js';

const prisma = new PrismaClient();

module.exports = {
  name: Discord.Events.InteractionCreate,
  async execute(interaction: Discord.Interaction) {
    if (interaction.isButton()) {
      if (interaction.customId.startsWith('verification1 1')) {
        Promise.all([
          interaction.deferReply(),
          interaction.message.delete(),
          interaction.client.guilds.fetch(interaction.customId.split(',').at(1)!),
        ])
          .then(async guild =>
            guild[2].members
              .kick(
                `${interaction.user.id}`,
                `User is under 13 | ${
                  (await interaction.client.guilds.fetch(interaction.customId.split(',').at(1)!))
                    .name
                }`
              )
              .catch(async err => {
                await interaction.deleteReply();
                throw err;
              })
          )
          .then(() =>
            Promise.all([
              interaction.user.send({
                embeds: [Components.embed.verification.under13],
                components: [Components.button.verification.under13],
              }),
              interaction.deleteReply(),
            ])
          );
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
        Promise.all([
          interaction.deferReply(),
          interaction.message.delete(),
          client.users
            .fetch(interaction.user.id)
            .then(async user => {
              const message = await user.dmChannel?.messages.fetch(
                interaction.customId.split(',').at(3)!
              );
              return message;
            })
            .then(async message => await message?.delete()),
          prisma.guild.findUnique({ where: { id: interaction.customId.split(',').at(1) } }),
          prisma.guildVerification.findUnique({ where: { id: interaction.user.id } }),
        ])
          .then(async db => {
            const channel = await client.channels.fetch(db[3]?.settings?.verification.channel!);
            return { db, channel };
          })
          .then(async data => {
            if (!data?.channel?.isTextBased()) return;
            await data.channel
              .send({
                embeds: [
                  Components.embed.verification.review(
                    interaction.user,
                    await client.guilds.fetch(interaction.customId.split(',').at(1)!),
                    data.db[4]?.age,
                    data.db[3]?.settings?.verification.questions,
                    data.db[4]?.submissions
                  ),
                ],
                components: [Components.button.verification.review],
              })
              .catch(async err => {
                await interaction.deleteReply();
                throw err;
              });
            return data;
          })
          .then(async data =>
            Promise.all([
              interaction.user.send({
                embeds: [
                  Components.embed.verification[3](
                    await client.guilds.fetch(interaction.customId.split(',').at(1)!),
                    data?.db[4]?.age,
                    data?.db[3]?.settings?.verification.questions,
                    data?.db[4]?.submissions
                  ),
                ],
              }),
              interaction.deleteReply(),
            ])
          )
          .finally(() => prisma.$disconnect);
      }

      if (interaction.customId.startsWith('verification2 2')) {
        await interaction.deferReply();
        const id = interaction.customId.split(',').at(1);
        const buttons = Components.button.verification[1](id);
        buttons.components.forEach(buttons =>
          buttons.setDisabled(false).setStyle(Discord.ButtonStyle.Secondary)
        );
        Promise.all([interaction.message.delete(), client.users.fetch(interaction.user.id)])
          .then(async user => {
            const message = await user[1].dmChannel?.messages.fetch(
              interaction.customId.split(',').at(3)!
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
                    await client.guilds.fetch(id!)
                  ),
                ],
                components: [buttons],
              }),
              interaction.deleteReply(),
            ])
          );
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

    if (interaction.type == Discord.InteractionType.ModalSubmit) {
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
        if (interaction.isFromMessage()) {
          await interaction.message.edit({
            components: [buttons],
          });
        }
        const id = interaction.customId.split(',');
        id.shift();
        let age: string | undefined = undefined;
        if (buttonId === 1) age = '13-15';
        if (buttonId === 2) age = '16-17';
        if (buttonId === 3) age = '18+';
        Promise.all([
          prisma.guild.update({
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
          }),
          interaction.user.send({
            embeds: [
              Components.embed.verification[2](
                interaction,
                await client.guilds.fetch(interaction.customId.split(',').at(1)!)
              ),
            ],
            components: [Components.button.verification[2](id)],
          }),
        ]).finally(() => prisma.$disconnect);
      }
    }
  },
};
