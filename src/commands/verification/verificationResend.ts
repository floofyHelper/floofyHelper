import Discord from 'discord.js';

import Client from '../../classes/client';
import Components from '../../classes/components';

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('staff')
    .setDescription('All staff commands for verification')
    .setDMPermission(false)
    .addSubcommandGroup(subcommandGroup =>
      subcommandGroup
        .setName('verification')
        .setDescription('Verification commands')
        .addSubcommand(subcommand =>
          subcommand
            .setName('resend')
            .setDescription('Resend verification to a user')
            .addUserOption(option =>
              option
                .setName('user')
                .setDescription('The user you want to resend the verification application to')
                .setRequired(true)
            )
        )
    ),
  async execute(interaction: Discord.CommandInteraction) {
    if (!interaction.options.getUser('user')?.bot === true) {
      await interaction
        .deferReply({ ephemeral: true })
        .then(() => {
          const user = interaction.options.getUser('user');
          return user;
        })
        .then(user => {
          user?.send({
            embeds: [Components.embed.verification[1](user, interaction.guild)],
            components: [Components.button.verification[1](interaction.guild?.id)],
          });
          return user;
        })
        .then(user =>
          interaction.editReply({
            embeds: [
              Components.embed.success(
                `Successfully sent verification application to ${user?.username}`
              ),
            ],
          })
        )
        .finally(() => setTimeout(async () => await interaction.deleteReply(), 5000));
    } else {
      interaction.reply({
        embeds: [
          Components.embed.error(`${interaction.options.getUser('user')?.username} isn't a user!`),
        ],
        components: [Components.button.error(Client.errorCodes.notFound)],
        ephemeral: true,
      });
    }
    /* function postError(
      interaction: Discord.CommandInteraction,
      errorCode: any,
      errorReason: string,
      _errorDescription: string
    ) {
      Components.embed.error;
      interaction.reply({
        embeds: [Components.embed.error(errorReason)],
        components: [Components.button.error(errorCode)],
        ephemeral: true,
      });
    }*/
  },
};
