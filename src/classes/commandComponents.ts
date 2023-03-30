//@ts-nocheck
import Discord from 'discord.js';

export default class CommandComponents {
  static embed = {
    rules: {
      1: new Discord.EmbedBuilder() // "Rules" image
        .setColor(0xfdbeff)
        .setImage(
          'https://cdn.discordapp.com/attachments/1008435494331355247/1008436253890453665/Floofy_Den_RULES.png?size=4096'
        ),

      2: async (interaction: Discord.CommandInteraction) =>
        new Discord.EmbedBuilder() // Moderation
          .setColor(0xe9cbff)
          .setTitle('Moderation')
          .setDescription(
            `${Discord.quote(
              `We use <@!${interaction.client.user.id}> for moderation. <@!${interaction.client.user.id}> uses a "heat" system for punishments. The more you speak, the more "heat" is assigned to you. Spam, embeds, media, emojis, and stickers add additional heat. Your heat will cool down over time. You can find more info on our heat system [**here**](https://docs.wickbot.com/v3/overview/wicks-features/heat-system).`
            )}\n\n❗️**Please Keep In Mind If You Reach 10 Warns, You Will Be Banned**❗️`
          )
          .addFields([
            {
              name: 'Our Staff Roles:',
              value: Discord.blockQuote(
                Object.values(this.staffRoleIds)
                  .map(role => `<@&${role}>\n`)
                  .join('')
              ),
            },
            {
              name: "And Here's Our Current Staff!",
              value: Discord.blockQuote(this.createStaffList(interaction)),
            },
            {
              name: "We Also Follow Discord's ToS/Guidelines! <:discord:976202801992577134>",
              value: `${Discord.quote(
                'Catch up on them here:'
              )}\n**https://discord.com/terms\nhttps://discord.com/guidelines**`,
            },
          ]),

      3: new Discord.EmbedBuilder() // Donator Roles
        .setColor(0xd5d9fe)
        .setTitle('Donator Roles')
        .setDescription(
          `${Discord.quote(
            '<@&949181972113162282>, <@&944278945090658345>, and <@&949181980455612436> roles allow access to <#944280501605261362> and <#944280717255381013>, and ability to post media/embeds in <#943404593105231885>.'
          )}\n\n${Discord.quote(
            'Additionally, <@&944278945090658345> and <@&949181980455612436>s get access to <#944061706777280592>.'
          )}`
        ),

      4: new Discord.EmbedBuilder()
        .setColor(0xc1e6fe)
        .setTitle('Level System')
        .setDescription(
          Discord.blockQuote(
            'We use <@!172002275412279296> for ranking.\nYou can check your rank in <#943879185234014218> using the `t! rank` command.'
          )
        )
        .addFields({
          name: 'Our Ranks Here Include:',
          value: `${Discord.quote(
            '<@&944160705530195979> - (Unlocked after 10mins) Access to media/embeds and VCs'
          )}\n${Discord.quote('<@&944160724190634014>')}\n${Discord.quote(
            '<@&944161115254968370> - Access to embed perms in <#943404593105231885>'
          )}\n${Discord.quote('<@&944161140479492096>')}\n${Discord.quote(
            '<@&944161158535979048>'
          )}\n${Discord.quote('<@&944161181604671498>')}\n${Discord.quote(
            '<@&944161206179090503> - Access to <#944061706777280592> and <#944280717255381013>'
          )}\n\n${Discord.quote(
            'More information on Tatsu can be found [**here**](https://tatsu.fandom.com/wiki/Tatsu_Wiki).'
          )}`,
        }),

      5: new Discord.EmbedBuilder()
        .setColor(0xadf3fd)
        .setTitle('Server Rules')
        .addFields(
          {
            name: 'Discord ToS',
            value: Discord.quote(
              '<:redDash:976202267726315590>Above all else, We follow Discord ToS and we expect all users to follow ToS as well.'
            ),
          },
          {
            name: 'Listen to Staff',
            value: Discord.quote(
              '<:redDash:976202267726315590>Do not block staff/ignore staff. This is a bannable offense.'
            ),
          },
          {
            name: 'Punishments',
            value: Discord.quote(
              "<:orangeDash:976202267441119252>Do not try to evade/circumvent a ban/punishment, it's just gonna get you into more trouble. If you feel like a punishment was wrong, please contact us so we can sort the issue. An appeal form gets automatically sent with each infraction."
            ),
          },
          {
            name: 'Avoid Drama & Touchy Subjects',
            value: Discord.quote(
              '<:orangeDash:976202267441119252>Do not seek to make others uncomfortable. We do not allow these topics: Suicide/self harm/acts of violence/substance abuse/drug talk/alcohol/politics/religion/graphic content/homophobia/sexism/transphobia/racism/begging for free art or nitro. If you break this rule, it will result in punishment.'
            ),
          },
          {
            name: 'NSFW Content',
            value: Discord.quote(
              '<:yellowDash:976202267298512898>This server does not allow NSFW content of any kind. You may be asked to change your profile picture or cover if it contains NSFW content.'
            ),
          },
          {
            name: 'Appropriate Channels',
            value: Discord.quote(
              '<:yellowDash:976202267298512898>Please do your best to post in the correct channels.'
            ),
          },
          {
            name: 'Artwork',
            value: Discord.quote(
              "<:greenDash:976202267290140713>Do not trace/claim other artists' work. Always give credit where it is needed. DO NOT STEAL!"
            ),
          },
          {
            name: 'Voice Channels',
            value: Discord.quote(
              '<:greenDash:976202267290140713>Just as text channel rules, keep VCs to the correct topic/discussion. No NSFW topics. Do not overuse voicemods/soundboards. Drop topics that other users express concerns about/ are uncomfortable about.'
            ),
          },
          {
            name: 'Alt Accounts',
            value: Discord.quote(
              '<:blueDash:976202267235581992>We do not allow alt accounts unless approved by a Moderator. If you are avoiding punishment, you will be banned.'
            ),
          },
          {
            name: 'Foreign Languages',
            value: Discord.quote(
              "<:blueDash:976202267235581992>This is primarily an English-speaking server, we ask that our members stick to it when they chat. Staff can't spend a lot of time translating chat."
            ),
          },
          {
            name: "❗️These Rules Aren't Final, Punishments Are Ultimately Up To Staff's Discretion",
            value: '<:blank:1001882745158504600>',
          },
          {
            name: 'TLDR:',
            value: `${Discord.quote(
              "Be a sensible person; don't spam or be rude/bring up awkward subjects"
            )}\n${Discord.quote(
              "Don't try to circumvent punishments or ignore staff"
            )}\n${Discord.quote('Be appropriate in VCs')}\n${Discord.quote(
              "Don't steal other's art, PLEASE give credit"
            )}\n${Discord.quote('NO NSFW')}\n${Discord.quote(
              'Have fun! <a:pepeSword:945492412707524649>'
            )}\n<:blank:1001882745158504600>`,
          }
        )
        .setFooter({
          text: 'Ellos!! Thank you for taking the time to read our rules! Have a cookie <3',
        }),
    },
  };

  static floofyDenId = '975959193028788244'; // ID for Floofy Den
  static staffRoleIds = {
    verified: '975959193028788246',
  };

  async createStaffList(interaction: Discord.CommandInteraction) {
    // Puts `staffRoleIds` into a list and mentions all users that are in the list under their respective object key
    const ownerString = `**Owner**: <@${await interaction.client.guilds
      .fetch(this.floofyDenId)
      .then(guild => guild.ownerId)}>`;
    const staffList = await Promise.all(
      Object.entries(this.staffRoleIds).map(async ([key, value]) => {
        const role = await interaction.client.guilds.fetch(this.floofyDenId).then(async guild => {
          await guild.members.fetch();
          const role = await guild.roles.fetch(value);
          return role;
        });
        const members = role?.members.map(member => `<@!${member.user.id}>`).join(', ');
        const keyString = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()); // Convert camelCase to Regular Case
        return `**${keyString}**: ${members || 'None atm'}`;
      })
    );
    return `${ownerString}\n${staffList.join('\n')}`;
  }
}
