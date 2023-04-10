import Discord from "discord.js";

import Components from "../../classes/components";
import internal from "stream";

const managementRoleId: Discord.Snowflake = "976200010175750155";

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName("server")
    .setDescription("Server commands")
    .setDMPermission(false)
    .addSubcommandGroup((subcommandGroup) =>
      subcommandGroup
        .setName("embeds")
        .setDescription("All embeds for Floofy Den")
        .addSubcommand((subcommand) =>
          subcommand
            .setName("rules")
            .setDescription("Embeds for #rules")
            .addChannelOption((option) =>
              option //
                .setName("channel")
                .setDescription("Where to post the embed")
                .addChannelTypes(Discord.ChannelType.GuildText)
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("wartable")
            .setDescription("Embeds for #wartable")
            .addChannelOption((option) =>
              option
                .setName("channel")
                .setDescription("Where to post the embed")
                .addChannelTypes(Discord.ChannelType.GuildText)
                .setRequired(true)
            )
        )
        .addSubcommand((subcommand) =>
          subcommand
            .setName("staff-guidelines")
            .setDescription("Embeds for #staff-guidelines")
            .addChannelOption((option) =>
              option //
                .setName("channel")
                .setDescription("Where to post the embed")
                .addChannelTypes(Discord.ChannelType.GuildText)
                .setRequired(true)
            )
        )
    ),
  async execute(interaction: Discord.ChatInputCommandInteraction) {
    if (interaction.guildId !== process.env.FLOOFY_DEN_SERVER_ID) return;
    async function postEmbeds(
      embeds: Discord.EmbedBuilder | Discord.EmbedBuilder[],
      components?:
        | Discord.ActionRowBuilder<
            Discord.ButtonBuilder | Discord.StringSelectMenuBuilder
          >
        | Discord.ActionRowBuilder<
            Discord.ButtonBuilder | Discord.StringSelectMenuBuilder
          >[],
      content?: string,
      attachments?:
        | (
            | Discord.BufferResolvable
            | internal.Stream
            | Discord.JSONEncodable<Discord.APIAttachment>
            | Discord.Attachment
            | Discord.AttachmentBuilder
            | Discord.AttachmentPayload
          )
        | undefined
    ) {
      // Posts embed(s) to the channel specified in the slash command
      await interaction.client.guilds
        .fetch(`${process.env.FLOOFY_DEN_SERVER_ID}`)
        .then((guild) =>
          guild.channels
            .fetch(`${interaction.options.get("channel")?.value}`)
            .then(async (channel) => {
              if (channel?.type !== Discord.ChannelType.GuildText) return;
              const messageOptions: Discord.MessageCreateOptions = {
                embeds: Array.isArray(embeds) //
                  ? embeds.map((embed) => embed.toJSON())
                  : [embeds.toJSON()],
              };
              if (components) {
                messageOptions.components = Array.isArray(components)
                  ? components.map((component) => component.toJSON())
                  : [components.toJSON()];
              }
              if (content) {
                messageOptions.content = content;
              }
              if (attachments) {
                messageOptions.files = [attachments];
              }
              await channel.send(messageOptions);
            })
        );
    }

    if (interaction.options.getSubcommand() === "rules") {
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
        "Welcome to the server! We hope you enjoy your time here <a:biHeart:945327924070998016>"
      )
        .then(() =>
          interaction.editReply({
            embeds: [Components.embed.success("Successfully created embed!")],
          })
        )
        .finally(() =>
          setTimeout(async () => await interaction.deleteReply(), 5000)
        );
    }

    if (interaction.options.getSubcommand() === "wartable") {
      await interaction.deferReply({ ephemeral: true });
      await postEmbeds(
        Components.embed.floofyDen.warTable.post,
        Components.button.floofyDen.warTable("0")
      )
        .then(() =>
          interaction.editReply({
            embeds: [Components.embed.success("Successfully created embed!")],
          })
        )
        .finally(() =>
          setTimeout(async () => await interaction.deleteReply(), 5000)
        );
    }

    if (interaction.options.getSubcommand() === "staff-guidelines") {
      await interaction.deferReply({ ephemeral: true });
      await interaction.guild?.roles
        .fetch(managementRoleId)
        .then(async (role) => {
          await interaction.client.guilds
            .fetch(`${process.env.FLOOFY_DEN_SERVER_ID}`)
            .then((guild) =>
              guild.channels
                .fetch(`${interaction.options.get("channel")?.value}`)
                .then(async (channel) => {
                  if (channel?.type !== Discord.ChannelType.GuildText) return;
                  await channel.send({
                    embeds: [
                      Components.embed.floofyDen.staffGuidelines[1],
                      Components.embed.floofyDen.staffGuidelines[2],
                    ],
                    files: [
                      new Discord.AttachmentBuilder(
                        "src/assets/staffGuidelines.png"
                      ),
                    ],
                  });
                  await channel.send({
                    embeds: [
                      Components.embed.floofyDen.staffGuidelines[3],
                      Components.embed.floofyDen.staffGuidelines[4],
                      Components.embed.floofyDen.staffGuidelines[5],
                      Components.embed.floofyDen.staffGuidelines[6],
                      Components.embed.floofyDen.staffGuidelines[7],
                      Components.embed.floofyDen.staffGuidelines[8](
                        role?.members
                          .map((member: Discord.GuildMember) =>
                            member.user.toString()
                          )
                          .join(", ")
                      ),
                    ],
                    components: [
                      Components.selectMenu.floofyDen.staffGuidelines,
                      Components.button.floofyDen.staffGuidelines[1],
                    ],
                  });
                })
            )
            /* await interaction.guild?.members.fetch();
       postEmbeds(
          [
            Components.embed.floofyDen.staffGuidelines[1],
            Components.embed.floofyDen.staffGuidelines[2],
            Components.embed.floofyDen.staffGuidelines[3],
            Components.embed.floofyDen.staffGuidelines[4],
            Components.embed.floofyDen.staffGuidelines[5],
            Components.embed.floofyDen.staffGuidelines[6],
            Components.embed.floofyDen.staffGuidelines[7],
            Components.embed.floofyDen.staffGuidelines[8](
              role?.members.map((member: Discord.GuildMember) => member.user.toString()).join(', ')
            ),
          ],
          [
            Components.selectMenu.floofyDen.staffGuidelines,
            Components.button.floofyDen.staffGuidelines[1],
            Components.button.floofyDen.staffGuidelines[2],
          ],
          undefined,
          new Discord.AttachmentBuilder('src/assets/staffGuidelines.png')
        )*/
            .then((result) => {
              console.log(result);
              interaction.editReply({
                embeds: [
                  Components.embed.success("Successfully created embed!"),
                ],
              });
            })
            .finally(() => setTimeout(() => interaction.deleteReply(), 5000));
        });
    }
  },
};
