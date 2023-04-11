import Discord from 'discord.js';

import Components from '../../classes/components';

module.exports = {
  name: Discord.Events.InteractionCreate,
  async execute(interaction: Discord.ButtonInteraction) {
    if (!interaction.isButton()) return;
    async function toggleAntiraid() {
      let isEnabled: boolean = false;
      let slowMode: { count: number; timeAmount: number } = {
        count: 0,
        timeAmount: 0,
      };
      let button: { id: string; label: string; style: Discord.ButtonStyle } = {
        id: '0',
        label: 'Enable Panic Mode',
        style: Discord.ButtonStyle.Danger,
      };
      if (interaction.customId.split(',').at(1) === '0') {
        isEnabled = true;
        slowMode.timeAmount = 15;
        button.id = '1';
        button.label = 'Disable Panic Mode';
        button.style = Discord.ButtonStyle.Secondary;
      }
      const reason: string = `${interaction.user.tag} ${
        isEnabled ? 'enabled' : 'disabled'
      } panic mode features`;
      // Enable slowmode for all channels that @everyone can use
      const channels = await interaction.guild?.channels.fetch();
      if (!channels) return;
      const promises = channels.map(async channel => {
        if (interaction.guild?.roles.everyone) {
          if (
            channel?.type === Discord.ChannelType.GuildText &&
            channel
              .permissionsFor(interaction.guild?.roles.everyone)
              .has(
                Discord.PermissionFlagsBits.SendMessages && Discord.PermissionFlagsBits.ViewChannel
              )
          ) {
            await (channel as Discord.GuildTextBasedChannel)
              .setRateLimitPerUser(slowMode.timeAmount, reason)
              .then(() => slowMode.count++);
          }
        }
      });
      const buttons = Components.button.floofyDen.warTable(button.id);
      buttons.components[0].setLabel(button.label).setStyle(button.style);
      if (interaction.channel?.type !== Discord.ChannelType.GuildText) return;
      const [, disabledInvites, automod] = await Promise.all([
        interaction.message.edit({ components: [buttons] }),
        interaction.guild?.disableInvites(isEnabled),
        interaction.guild?.autoModerationRules.edit('1092630554941325322', {
          triggerMetadata: {
            presets: isEnabled
              ? [
                  Discord.AutoModerationRuleKeywordPresetType.Profanity,
                  Discord.AutoModerationRuleKeywordPresetType.SexualContent,
                  Discord.AutoModerationRuleKeywordPresetType.Slurs,
                ]
              : [
                  Discord.AutoModerationRuleKeywordPresetType.SexualContent,
                  Discord.AutoModerationRuleKeywordPresetType.Slurs,
                ],
          },
          reason: reason,
        }),
        /*isEnabled
          ? interaction.message.startThread({
              name: 'war-planning',
              autoArchiveDuration: Discord.ThreadAutoArchiveDuration.ThreeDays,
              reason: reason,
            })
          : interaction.message.thread?.delete(reason),*/
      ]);
      await Promise.all(promises);
      return { slowMode, isEnabled, disabledInvites, automod };
    }
    if (interaction.customId.startsWith('floofyDenWarTable')) {
      await interaction.deferReply({ ephemeral: true });
      await toggleAntiraid().then(result =>
        interaction.editReply({
          embeds: [Components.embed.floofyDen.warTable[1](result)],
        })
      );
    }
  },
};
