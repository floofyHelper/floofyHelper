import Discord from 'discord.js';

import Components from '../classes/components';

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
    await interaction.deferReply({ ephemeral: true });
    if (!interaction.isUserContextMenuCommand) return;
    const user = interaction.options.getUser('user');
    await user?.send({
      embeds: [Components.embed.verification[1](user, interaction.guild)],
      components: [Components.button.verification[1](interaction.guild?.id)],
    });
    await interaction.editReply('Sent!');
  },
};
