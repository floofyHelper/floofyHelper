import Discord from 'discord.js';
import { PrismaClient } from '@prisma/client';

import Client, { client } from '../classes/client.js';
import * as functions from '../classes/functions.js';

const prisma = new PrismaClient();
const embed = Client.embed;
const button = Client.button;
const modal = Client.modal;

module.exports = {
  name: Discord.Events.InteractionCreate,
  once: false,
  execute(interaction: Discord.Events) {
    console.log(interaction);
    if (interaction === Discord.Events.GuildMemberAdd)
      async (member: {
        guild: { id: string };
        user: { bot: boolean };
        send: (arg0: {
          embeds: Discord.EmbedBuilder[];
          components: Discord.ActionRowBuilder<Discord.ButtonBuilder>[];
        }) => any;
      }) => {
        try {
          console.log('it worked?');
          if (member.guild.id === '943404593105231882') return; /* REMOVE THIS BEFORE STAGING */
          if (member.user.bot === true) return;
          const buttons = button.verification[1](member.guild.id);
          buttons.components.forEach(buttons => {
            buttons.setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
          });
          // Adding guild & verification data to database
          await prisma.guild.create({
            data: {
              id: member.guild.id,
              verification: {
                verificationId: {
                  verificationIdSubmissions: [],
                },
              },
            },
          });

          // Sending first verification embed to user
          await member.send({
            embeds: [embed.verification[1](member.user, member.guild)],
            components: [buttons],
          });
        } catch (err) {
          await functions.sendToErrorLog(err, member);
        }
      };

    if (interaction === Discord.Events.InteractionCreate)
      async (interaction: {
        isButton: () => any;
        customId: string;
        message: { delete: () => void; id: any };
        user: {
          send: (arg0: {
            embeds: Discord.EmbedBuilder[];
            components: Discord.ActionRowBuilder<Discord.ButtonBuilder>[];
          }) => any;
          id: string;
          bot: boolean;
        };
        client: {
          guilds: {
            cache: {
              get: (arg0: any) => {
                (): any;
                new (): any;
                members: {
                  (): any;
                  new (): any;
                  kick: { (arg0: string, arg1: string): any; new (): any };
                };
                name: any;
              };
            };
          };
        };
        showModal: (arg0: Discord.ModalBuilder) => any;
        deferUpdate: () => any;
        guild: { id: any; name: undefined };
      }) => {
        if (!interaction.isButton()) return;
        try {
          if (interaction.customId.startsWith('verification1 1')) {
            console.log(interaction);
            interaction.message.delete();
            await interaction.user.send({
              embeds: [embed.verification.under13],
              components: [button.verification.under13],
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
            await interaction.showModal(modal.verification[1](Id));
          }

          if (interaction.customId.startsWith('verification1 3')) {
            const Id = interaction.customId.split(',');
            Id.shift();
            Id.push(`2,${interaction.message.id}`);
            await interaction.showModal(modal.verification[1](Id));
          }

          if (interaction.customId.startsWith('verification1 4')) {
            const Id = interaction.customId.split(',');
            Id.shift();
            Id.push(`3,${interaction.message.id}`);
            await interaction.showModal(modal.verification[1](Id));
          }

          if (interaction.customId.startsWith('verification2 1')) {
            await interaction.deferUpdate();
            const message = client.users.cache
              .get(interaction.user.id)
              ?.dmChannel?.messages.cache.get(interaction.customId.split(',').at(3)!);
            await interaction.message.delete();
            await message?.delete();
            // Age
            /*let age = undefined
            if (interaction.customId.split(',').at(2) === '2') {
              age = '13-15'
            }
            if (interaction.customId.split(',').at(2) === '3') {
              age = '16-17'
            }
            if (interaction.customId.split(',').at(2) === '4') {
              age = '18+'
            }*/
            /*const answer = await prisma.guild.findUnique({
              where: {
                id: interaction.customId.split(',').at(1)
              },
              select: { verification: true },
            });
            
            await interaction.user.send({
              embeds: [
                embed.verification[3](
                  '18+',
                  answer?.verification.id
                  answer?.modalSubmissions.at(1),
                  answer?.modalSubmissions.at(2),
                  answer?.modalSubmissions.at(3),
                  answer?.modalSubmissions.at(4)
                ),
              ],
            });*/
          }

          if (interaction.customId.startsWith('verification2 2')) {
            if (interaction.user.bot === false) {
              await interaction.deferUpdate();
              const id = interaction.customId.split(',').at(1);
              const buttons = button.verification[1](id);
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
                embeds: [embed.verification[1](interaction.user, client.guilds.cache.get(id!))],
                components: [buttons],
              });
            }
          }

          if (interaction.customId === 'verificationHelp 1') {
            await interaction.showModal(modal.ticket[1]);
          }

          if (interaction.customId === 'verificationHelp 2') {
            if (interaction.user.bot === false) {
              const buttons = button.verification[1](interaction.guild?.id);
              buttons.components.forEach(buttons => {
                buttons.setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
              });
              await interaction.deferUpdate();
              if (interaction.guild?.name === undefined) {
              } else {
                await interaction.user.send({
                  embeds: [embed.verification[1](interaction.user, interaction.guild)],
                  components: [buttons],
                });
              }
            }
          }
        } catch (err) {
          await functions.sendToErrorLog(err, interaction);
        }
      };

    if (interaction === Discord.Events.InteractionCreate)
      async (interaction: {
        type: Discord.InteractionType;
        customId: string;
        isFromMessage: () => any;
        update: (arg0: { components: Discord.ActionRowBuilder<Discord.ButtonBuilder>[] }) => void;
        user: {
          send: (arg0: {
            embeds: Discord.EmbedBuilder[];
            components: Discord.ActionRowBuilder<Discord.ButtonBuilder>[];
          }) => void;
        };
      }) => {
        if (interaction.type !== Discord.InteractionType.ModalSubmit) return;
        try {
          if (interaction.customId.startsWith('verification1')) {
            const buttons = button.verification[1]();
            buttons.components.forEach(buttons => {
              buttons.setDisabled(true).setStyle(Discord.ButtonStyle.Secondary);
            });
            const buttonId: number = Number(interaction.customId.split(',').at(2));
            buttons.components[buttonId].setStyle(Discord.ButtonStyle.Primary);
            if (interaction.isFromMessage()) {
              interaction.update({
                components: [buttons],
              });
            }
            const id = interaction.customId.split(',');
            id.shift();
            const guildId = client.guilds.cache.get(interaction.customId.split(',').at(1)!);
            interaction.user.send({
              embeds: [embed.verification[2](interaction, guildId?.iconURL())],
              components: [button.verification[2](id)],
            });
            // Sending modal submissions to database
            /* await prisma.verification.update({
              where: { id: interaction.user.id },
              data: {
                modalSubmissions: [
                  interaction.fields.getTextInputValue('verification1 1'),
                  interaction.fields.getTextInputValue('verification1 2'),
                  interaction.fields.getTextInputValue('verification1 3'),
                  interaction.fields.getTextInputValue('verification1 4'),
                  interaction.fields.getTextInputValue('verification1 5'),
                ],
              },
            });*/
          }
        } catch (err) {
          await functions.sendToErrorLog(err, interaction);
        }
      };

    client.on(Discord.Events.InteractionCreate, async interaction => {
      if (!interaction.isChatInputCommand()) return;
      try {
        const { commandName } = interaction;
        if (commandName === 'help') {
          await interaction.reply({
            embeds: [embed.verification.help(client)],
            components: [button.verification.help],
            ephemeral: true,
          });
        }
      } catch (err) {
        await functions.sendToErrorLog(err, interaction);
      }
    });
  },
};
