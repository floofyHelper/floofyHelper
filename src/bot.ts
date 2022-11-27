import('./deployCommands.js');

import Discord from 'discord.js';

import Client, { client } from './classes/client.js';
import * as functions from './classes/functions.js';
import Logger from './classes/logger.js';

const embed = Client.embed;
const button = Client.button;
const modal = Client.modal;

// -------------------------------------------------------------------------------

client.on('guildMemberAdd', async member => {
  try {
    if (member.guild.id === '943404593105231882') return; /* REMOVE THIS BEFORE STAGING */
    if (member.user.bot === true) return;
    const buttons = button.verification[1](member.guild.id);
    buttons.components[0].setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
    buttons.components[1].setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
    buttons.components[2].setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
    buttons.components[3].setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
    // Adding guild & verification data to database
    /*await data
      .db('BaseInteraction')
      .collection('guild')
      .updateOne(
        { _id: member.guild.id },
        {
          $set: {
            name: member.guild.name,
            verification: {
              [member.user.id]: {
                username: member.user.username,
              },
            },
          },
        },
        { upsert: true }
      );*/
    // Sending first verification embed to user
    await member.send({
      embeds: [embed.verification[1](member.user, member.guild)],
      components: [buttons],
    });
  } catch (err) {
    await functions.sendToErrorLog(err, member);
  }
});

client.on('interactionCreate', async interaction => {
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
      Id.push(`2,${interaction.message.id}`);
      await interaction.showModal(modal.verification[1](Id));
    }

    if (interaction.customId.startsWith('verification1 3')) {
      const Id = interaction.customId.split(',');
      Id.shift();
      Id.push(`3,${interaction.message.id}`);
      await interaction.showModal(modal.verification[1](Id));
    }

    if (interaction.customId.startsWith('verification1 4')) {
      const Id = interaction.customId.split(',');
      Id.shift();
      Id.push(`4,${interaction.message.id}`);
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
    }

    if (interaction.customId.startsWith('verification2 2')) {
      if (interaction.user.bot === false) {
        await interaction.deferUpdate();
        const id = interaction.customId.split(',').at(1);
        const buttons = button.verification[1](id);
        buttons.components[0].setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
        buttons.components[1].setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
        buttons.components[2].setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
        buttons.components[3].setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
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
        buttons.components[0].setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
        buttons.components[1].setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
        buttons.components[2].setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
        buttons.components[3].setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
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
});

client.on('interactionCreate', async interaction => {
  if (interaction.type !== Discord.InteractionType.ModalSubmit) return;
  try {
    if (interaction.customId.startsWith('verification1')) {
      const buttons = button.verification[1]();
      if (interaction.customId.split(',').at(2) === '2') {
        buttons.components[0].setDisabled(true).setStyle(Discord.ButtonStyle.Secondary);
        buttons.components[1].setDisabled(true).setStyle(Discord.ButtonStyle.Primary);
        buttons.components[2].setDisabled(true).setStyle(Discord.ButtonStyle.Secondary);
        buttons.components[3].setDisabled(true).setStyle(Discord.ButtonStyle.Secondary);
        if (interaction.isFromMessage()) {
          interaction.update({
            components: [buttons],
          });
        }
      }
      if (interaction.customId.split(',').at(2) === '3') {
        buttons.components[0].setDisabled(true).setStyle(Discord.ButtonStyle.Secondary);
        buttons.components[1].setDisabled(true).setStyle(Discord.ButtonStyle.Secondary);
        buttons.components[2].setDisabled(true).setStyle(Discord.ButtonStyle.Primary);
        buttons.components[3].setDisabled(true).setStyle(Discord.ButtonStyle.Secondary);
        if (interaction.isFromMessage()) {
          interaction.update({
            components: [buttons],
          });
        }
      }
      if (interaction.customId.split(',').at(2) === '4') {
        buttons.components[0].setDisabled(true).setStyle(Discord.ButtonStyle.Secondary);
        buttons.components[1].setDisabled(true).setStyle(Discord.ButtonStyle.Secondary);
        buttons.components[2].setDisabled(true).setStyle(Discord.ButtonStyle.Secondary);
        buttons.components[3].setDisabled(true).setStyle(Discord.ButtonStyle.Primary);
        if (interaction.isFromMessage()) {
          interaction.update({
            components: [buttons],
          });
        }
      }
      const id = interaction.customId.split(',');
      id.shift();
      const guildId = client.guilds.cache.get(interaction.customId.split(',').at(1)!);
      interaction.user
        .send({
          embeds: [embed.verification[2](interaction, guildId?.iconURL())],
          components: [button.verification[2](id)],
        })
        .catch(console.error);
      // Sending modal submissions to database
      /*await data
        .db('BaseInteraction')
        .collection('guild')
        .updateOne(
          { _id: guildId?.id },
          {
            $set: {
              name: guildId?.name,
              verification: {
                [interaction.user.id]: {
                  username: interaction.user.username,
                  modalSubmissions: [
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
          { upsert: true }
        );*/
    }
  } catch (err) {
    await functions.sendToErrorLog(err, interaction);
  }
});

client.on('interactionCreate', async interaction => {
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

// -------------------------------------------------------------------------------

new Logger(`${client.user?.username}`).success(`${client.user?.tag} is logged in`);
