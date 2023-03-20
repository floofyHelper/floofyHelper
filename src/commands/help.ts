import Discord from 'discord.js';

import { client } from '../classes/client';
import Components from '../classes/components';
//import * as functions from '../classes/functions.js';

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('help')
    .setDescription('Having issues with verification?')
    .setDMPermission(false),
  async execute(interaction: any) {
    try {
      const { commandName } = interaction;
      if (commandName === 'help') {
        await interaction.reply({
          embeds: [Components.embed.verification.help(client.user)],
          components: [Components.button.verification.help],
          ephemeral: true,
        });
      }
    } catch (err) {
      // await functions.sendToErrorLog(err, interaction);
    }
  },
};
