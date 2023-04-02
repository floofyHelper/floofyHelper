import Discord from 'discord.js';
import Components from '../../classes/components';

module.exports = {
  name: Discord.Events.InteractionCreate,
  async execute(interaction: Discord.ButtonInteraction) {
    if (interaction.isButton()) {
      async function toggleSlowMode(buttonState: string) {
        let slowModeCount: number = 0;
        let slowModeAmount: number = 0;
        if (buttonState === 'off') {
          slowModeAmount = 10;
        }
        const channels = await interaction.guild?.channels.fetch();
        if (!channels) return;
        const promises = channels.map(async channel => {
          if (interaction.guild?.roles.everyone) {
            if (
              channel?.type === Discord.ChannelType.GuildText &&
              channel
                .permissionsFor(interaction.guild?.roles.everyone)
                .has(
                  Discord.PermissionFlagsBits.SendMessages &&
                    Discord.PermissionFlagsBits.ViewChannel
                )
            ) {
              await (channel as Discord.GuildTextBasedChannel)
                .setRateLimitPerUser(slowModeAmount)
                .then(() => {
                  slowModeCount++;
                });
            }
          }
        });
        await Promise.all(promises);
        return slowModeCount;
      }

      if (interaction.customId.startsWith('floofyDenWartable')) {
        await interaction.deferReply({ ephemeral: true });
        if (interaction.customId.split(',').at(1) === 'off') {
          const buttonState = 'on';
          const button = Components.button.floofyDen.wartable[1](buttonState);
          button.components[0].setLabel('Enable');
          Promise.all([
            interaction.editReply({
              embeds: [
                Components.embed.success(
                  `Disabled slowmode on ${await toggleSlowMode(buttonState)} channels.`
                ),
              ],
            }),
            interaction.message.edit({
              components: [button],
            }),
          ]);
        } else {
          const buttonState = 'off';
          const button = Components.button.floofyDen.wartable[1](buttonState);
          button.components[0].setLabel('Disable');
          Promise.all([
            interaction.editReply({
              embeds: [
                Components.embed.success(
                  `Enabled slowmode on ${await toggleSlowMode(buttonState)} channels.`
                ),
              ],
            }),
            ,
            interaction.message.edit({
              components: [button],
            }),
          ]);
        }
      }
    }
  },
};
