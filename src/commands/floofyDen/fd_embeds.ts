import Discord, { ButtonBuilder } from 'discord.js';

import Components from '../../classes/components';

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
        .addSubcommand(subcommand =>
          subcommand
            .setName('wartable')
            .setDescription('Embeds for #wartable')
            .addChannelOption(option =>
              option
                .setName('channel')
                .setDescription('Where to post the embed')
                .addChannelTypes(Discord.ChannelType.GuildText)
                .setRequired(true)
            )
        )
    ),
  async execute(interaction: Discord.ChatInputCommandInteraction) {
    if (interaction.guildId !== process.env.FLOOFY_DEN_SERVER_ID) return;
    async function postEmbeds(
      embeds: Discord.EmbedBuilder | Discord.EmbedBuilder[],
      buttons?: Discord.ActionRowBuilder<ButtonBuilder> | Discord.ActionRowBuilder<ButtonBuilder>[],
      content?: string
    ) {
      // Posts embed(s) to the channel specified in the slash command
      await interaction.client.guilds.fetch(`${process.env.FLOOFY_DEN_SERVER_ID}`).then(guild =>
        guild.channels.fetch(`${interaction.options.get('channel')?.value}`).then(async channel => {
          if (channel?.type !== Discord.ChannelType.GuildText) return;
          const messageOptions: Discord.MessageCreateOptions = {
            embeds: Array.isArray(embeds) //
              ? embeds.map(embed => embed.toJSON())
              : [embeds.toJSON()],
          };
          if (buttons) {
            messageOptions.components = Array.isArray(buttons)
              ? buttons.map(button => button.toJSON())
              : [buttons.toJSON()];
          }
          if (content) {
            messageOptions.content = content;
          }
          await channel.send(messageOptions);
        })
      );
    }

    if (interaction.options.getSubcommand() === 'rules') {
      await interaction.deferReply({ ephemeral: true });
      await postEmbeds(
        [
          Components.embed.floofyDen.rules[1],
          await Components.embed.floofyDen.rules[2](interaction),
          Components.embed.floofyDen.rules[3],
          Components.embed.floofyDen.rules[4],
          Components.embed.floofyDen.rules[5],
        ],
        undefined,
        'Welcome to the server! We hope you enjoy your time here <a:biHeart:945327924070998016>'
      )
        .then(() =>
          interaction.editReply({
            embeds: [Components.embed.success('Successfully created embed!')],
          })
        )
        .finally(() => setTimeout(async () => await interaction.deleteReply(), 5000));
    }

    if (interaction.options.getSubcommand() === 'wartable') {
      await interaction.deferReply({ ephemeral: true });
      await postEmbeds(
        Components.embed.floofyDen.wartable[1],
        Components.button.floofyDen.wartable[1]('off')
      )
        .then(() =>
          interaction.editReply({
            embeds: [Components.embed.success('Successfully created embed!')],
          })
        )
        .finally(() => setTimeout(async () => await interaction.deleteReply(), 5000));
    }
  },
};
