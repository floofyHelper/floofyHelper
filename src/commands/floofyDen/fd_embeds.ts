import Discord from 'discord.js';

import Components from '../../classes/components';

const floofyDenId = '975959193028788244'; // ID for Floofy Den

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('dev')
    .setDescription('Dev commands')
    .setDMPermission(false)
    .addSubcommandGroup(subcommandGroup =>
      subcommandGroup
        .setName('embeds')
        .setDescription('All embeds for Floofy Den')
        .addSubcommand(subcommand =>
          subcommand
            .setName('rules')
            .setDescription('Embeds for #rules')
            .addChannelOption(option =>
              option //
                .setName('channel')
                .setDescription('Where to post the embed')
                .addChannelTypes(Discord.ChannelType.GuildText)
                .setRequired(true)
            )
        )
    ),
  async execute(interaction: Discord.CommandInteraction) {
    if (interaction.commandName === 'dev') {
      interaction.deferReply({ ephemeral: true });
      await interaction.client.guilds.fetch(floofyDenId).then(guild =>
        guild.channels.fetch(`${interaction.options.get('channel')?.value}`).then(async channel => {
          if (channel?.type !== Discord.ChannelType.GuildText) return;
          channel
            .send({
              content:
                'Welcome to the server! We hope you enjoy your time here <a:biHeart:945327924070998016>',
              embeds: [
                Components.embed.floofyDen.rules[1],
                await Components.embed.floofyDen.rules[2](interaction),
                Components.embed.floofyDen.rules[3],
                Components.embed.floofyDen.rules[4],
                Components.embed.floofyDen.rules[5],
              ],
            })
            .then(() =>
              interaction.editReply({
                embeds: [Components.embed.success('Successfully created embed!')],
              })
            )
            .finally(() => setTimeout(async () => await interaction.deleteReply(), 5000));
        })
      );
    }
  },
};
