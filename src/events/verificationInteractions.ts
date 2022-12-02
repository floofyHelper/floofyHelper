import Discord from 'discord.js';
import { PrismaClient } from '@prisma/client';

import { client } from '../classes/client.js';
import Components from '../classes/components.js';
import * as functions from '../classes/functions.js';

const prisma = new PrismaClient();

module.exports = {
  name: Discord.Events.InteractionCreate,
  async execute(interaction: Discord.Interaction) {
    if (interaction.isButton()) {
      try {
        if (interaction.customId.startsWith('verification1 1')) {
          await interaction.message.delete();
          await interaction.user.send({
            embeds: [Components.embed.verification.under13],
            components: [Components.button.verification.under13],
          });
          const guildId = interaction.customId.split(',').at(1);
          await interaction.client.guilds.cache
            .get(guildId!)
            ?.members.kick(
              `${interaction.user.id}`,
              `User is under 13 | ${interaction.client.guilds.cache.get(guildId!)?.name}`
            );
          const channel = client.channels.cache.get('2345342312');
          if (channel?.isTextBased()) {
            /*await channel.send({
              embeds: [embed.verification.review(interaction, guildId)],
            });*/
          }
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
          await interaction.deferUpdate();
          const message = client.users.cache
            .get(interaction.user.id)
            ?.dmChannel?.messages.cache.get(interaction.customId.split(',').at(3)!);
          await interaction.message.delete();
          await message?.delete();
          const answer = await prisma.user.findUnique({
            where: {
              id: interaction.user.id + interaction.customId.split(',').at(1),
            },
            select: { verification: true },
          });

          await interaction.user.send({
            embeds: [
              Components.embed.verification[3](
                answer?.verification.age,
                answer?.verification.submission.at(0),
                answer?.verification.submission.at(1),
                answer?.verification.submission.at(2),
                answer?.verification.submission.at(3),
                answer?.verification.submission.at(4)
              ),
            ],
          });
        }

        if (interaction.customId.startsWith('verification2 2')) {
          if (interaction.user.bot === false) {
            await interaction.deferUpdate();
            const id = interaction.customId.split(',').at(1);
            const buttons = Components.button.verification[1](id);
            buttons.components.forEach(buttons => {
              buttons.setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
            });
            const id2 = interaction.customId.split(',').at(3);
            const message = client.users.cache
              .get(interaction.user.id)
              ?.dmChannel?.messages.cache.get(id2!);
            await interaction.message.delete();
            await message?.delete();
            await interaction.user.send({
              embeds: [
                Components.embed.verification[1](interaction.user, client.guilds.cache.get(id!)),
              ],
              components: [buttons],
            });
          }
        }

        if (interaction.customId === 'verificationHelp 1') {
          await interaction.showModal(Components.modal.ticket[1]);
        }

        if (interaction.customId === 'verificationHelp 2') {
          if (interaction.user.bot === false) {
            const buttons = Components.button.verification[1](interaction.guild?.id);
            buttons.components.forEach(buttons => {
              buttons.setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
            });
            await interaction.deferUpdate();
            if (interaction.guild?.name === undefined) {
            } else {
              await interaction.user.send({
                embeds: [Components.embed.verification[1](interaction.user, interaction.guild)],
                components: [buttons],
              });
            }
          }
        }
      } catch (err) {
        await functions.sendToErrorLog(err, interaction);
      }
    }

    if (interaction.type == Discord.InteractionType.ModalSubmit) {
      try {
        if (interaction.customId.startsWith('verification1')) {
          const buttons = Components.button.verification[1]();
          buttons.components.forEach(buttons => {
            buttons.setDisabled(true).setStyle(Discord.ButtonStyle.Secondary);
          });
          const buttonId: number = Number(interaction.customId.split(',').at(2));
          buttons.components[buttonId].setStyle(Discord.ButtonStyle.Primary);
          if (interaction.isFromMessage()) {
            await interaction.update({
              components: [buttons],
            });
          }
          let age: string | undefined = undefined;
          if (buttonId === 1) age = '13-15';
          if (buttonId === 2) age = '16-17';
          if (buttonId === 3) age = '18+';
          // Sending modal submissions to database
          await prisma.user.update({
            where: { id: interaction.user.id + interaction.customId.split(',').at(1) },
            data: {
              verification: {
                age: age,
                submission: [
                  interaction.fields.getTextInputValue('verification1 1'),
                  interaction.fields.getTextInputValue('verification1 2'),
                  interaction.fields.getTextInputValue('verification1 3'),
                  interaction.fields.getTextInputValue('verification1 4'),
                  interaction.fields.getTextInputValue('verification1 5'),
                ],
              },
            },
          });
          const guildId = client.guilds.cache.get(interaction.customId.split(',').at(1)!);
          const id = interaction.customId.split(',');
          id.shift();
          await interaction.user.send({
            embeds: [Components.embed.verification[2](interaction, guildId?.iconURL())],
            components: [Components.button.verification[2](id)],
          });
        }
      } catch (err) {
        await functions.sendToErrorLog(err, interaction);
      }
    }
  },
};
