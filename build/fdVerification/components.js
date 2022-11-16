"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webhook = exports.selectMenu = exports.modal = exports.embed = exports.button = void 0;
const discord_js_1 = __importDefault(require("discord.js"));
// -------------------------------------------------------------------------------
/* Buttons */
exports.button = {
    error: new discord_js_1.default.ActionRowBuilder() //
        .addComponents(new discord_js_1.default.ButtonBuilder()
        .setLabel("Support Server")
        .setURL("https://discord.gg/hRmjAUvrpT")
        .setStyle(discord_js_1.default.ButtonStyle.Link)),
    verification: (guildId) => new discord_js_1.default.ActionRowBuilder()
        .addComponents(new discord_js_1.default.ButtonBuilder()
        .setCustomId(`verification1 1,${guildId}`)
        .setLabel("Under 13")
        .setStyle(discord_js_1.default.ButtonStyle.Secondary))
        .addComponents(new discord_js_1.default.ButtonBuilder()
        .setCustomId(`verification1 2,${guildId}`)
        .setLabel("13-15")
        .setStyle(discord_js_1.default.ButtonStyle.Secondary))
        .addComponents(new discord_js_1.default.ButtonBuilder()
        .setCustomId(`verification1 3,${guildId}`)
        .setLabel("16-17")
        .setStyle(discord_js_1.default.ButtonStyle.Secondary))
        .addComponents(new discord_js_1.default.ButtonBuilder()
        .setCustomId(`verification1 4,${guildId}`)
        .setLabel("18+")
        .setStyle(discord_js_1.default.ButtonStyle.Secondary)),
    verification2: (guildId) => new discord_js_1.default.ActionRowBuilder() //
        .addComponents(new discord_js_1.default.ButtonBuilder()
        .setCustomId(`verification2 1,${guildId}`)
        .setLabel("Submit")
        .setStyle(discord_js_1.default.ButtonStyle.Secondary))
        .addComponents(new discord_js_1.default.ButtonBuilder()
        .setCustomId(`verification2 2,${guildId}`)
        .setLabel("Restart")
        .setStyle(discord_js_1.default.ButtonStyle.Secondary)),
    under13: new discord_js_1.default.ActionRowBuilder() //
        .addComponents(new discord_js_1.default.ButtonBuilder()
        .setLabel("Discord Age Requirements")
        .setURL("https://discord.com/terms#2")
        .setStyle(discord_js_1.default.ButtonStyle.Link)),
    verificationReview: new discord_js_1.default.ActionRowBuilder() //
        .addComponents(new discord_js_1.default.ButtonBuilder()
        .setCustomId("verificationReview 1")
        .setLabel("Approve")
        .setStyle(discord_js_1.default.ButtonStyle.Success))
        .addComponents(new discord_js_1.default.ButtonBuilder()
        .setCustomId("verificationReview 2")
        .setLabel("Deny")
        .setStyle(discord_js_1.default.ButtonStyle.Danger))
        .addComponents(new discord_js_1.default.ButtonBuilder()
        .setCustomId("verificationReview 3")
        .setLabel("Question")
        .setStyle(discord_js_1.default.ButtonStyle.Secondary))
        .addComponents(new discord_js_1.default.ButtonBuilder()
        .setCustomId("verificationReview 4")
        .setLabel("More Options")
        .setStyle(discord_js_1.default.ButtonStyle.Secondary)),
    verificationHelp: new discord_js_1.default.ActionRowBuilder() //
        .addComponents(new discord_js_1.default.ButtonBuilder()
        .setCustomId("verificationHelp 1")
        .setLabel("Open a Ticket")
        .setStyle(discord_js_1.default.ButtonStyle.Primary)
        .setEmoji("🎟️"))
        .addComponents(new discord_js_1.default.ButtonBuilder()
        .setCustomId("verificationHelp 2")
        .setLabel("Resend Verification")
        .setStyle(discord_js_1.default.ButtonStyle.Secondary)
        .setEmoji("📨")),
};
// -------------------------------------------------------------------------------
/* Embeds */
exports.embed = {
    error: new discord_js_1.default.EmbedBuilder() //
        .setColor(0xeb716f)
        .setAuthor({
        name: "Something went wrong!",
        iconURL: "https://cdn.discordapp.com/emojis/1015719863446151198.webp?size=240&quality=lossless",
    }),
    errorLog: (errorReason) => new discord_js_1.default.EmbedBuilder() //
        .setColor(0xeb716f)
        .setAuthor({
        name: "Floofy Helper has had an error!",
        iconURL: "https://cdn.discordapp.com/emojis/1015719863446151198.webp?size=240&quality=lossless",
    })
        .setDescription(`> [<:status:975961724844924998> **Server Dashboard**](https://panel.wepwawet.net/server/bace9647)\n> [<:database:1033062779353051167> **MongoDB Atlas**](https://cloud.mongodb.com/v2/635185f826f2024f64a1ec28#clusters)\n> [<:github:1033062780372271104> **Github Repo**](https://github.com/floofyHelper)\n\`\`\`ts\n${errorReason}\`\`\``)
        .setTimestamp(),
    verification: (interaction, interaction2) => new discord_js_1.default.EmbedBuilder()
        .setAuthor({
        name: `Welcome ${interaction.username} to ${interaction2.name}!`,
        iconURL: `${interaction2.iconURL()}`,
    })
        .setDescription("Before you can access the server, we need you to answer some questions to make sure this server is a good fit for you. Whenever you're ready, please start below. \n \n > Please select your age group below to verify your account. \n > **Lying about your age will result in a ban.**"),
    verification2: (interaction, guildIcon) => new discord_js_1.default.EmbedBuilder()
        .setAuthor({
        name: "Look over your application, want to change anything?",
        iconURL: `${guildIcon}`,
    })
        .addFields({
        name: "How did you find us?",
        value: `> ${interaction.fields.getTextInputValue("verification1 1")}`,
    }, {
        name: "Why did you join our server?",
        value: `> ${interaction.fields.getTextInputValue("verification1 2")}`,
    }, {
        name: "Tell us a bit about yourself!",
        value: `> ${interaction.fields.getTextInputValue("verification1 3")}`,
    }, {
        name: "Have a fursona? Tell us about it!",
        value: `> ${interaction.fields.getTextInputValue("verification1 4")}`,
    }, {
        name: "Have you read the rules?",
        value: `> ${interaction.fields.getTextInputValue("verification1 5")}`,
    }),
    under13: new discord_js_1.default.EmbedBuilder() //
        .setColor(0xeb716f)
        .setAuthor({
        name: "As per Discord's ToS, you must be at least 13 years old to join this server.",
        iconURL: "https://cdn.discordapp.com/emojis/1015719863446151198.webp?size=240&quality=lossless",
    }),
    verificationApplicationSuccess: (age, answer1, answer2, answer3, answer4, answer5) => new discord_js_1.default.EmbedBuilder() //
        .setColor(0x69d09a)
        .setAuthor({
        name: "Verification application sent!",
        iconURL: "https://cdn.discordapp.com/emojis/1015719865572667625.webp?size=96&quality=lossless",
    })
        .setDescription("> All verification applications are reviewed manually by our staff, so sometimes it can take a while. **Usually, people are verified within 2 days.** *Please don't ping staff/open tickets about verifying you.*")
        .addFields({
        name: "Age:",
        value: `> ${age}`,
    }, {
        name: "How did you find us?",
        value: `> ${answer1}`,
    }, {
        name: "Why did you join our server?",
        value: `> ${answer2}`,
    }, {
        name: "Tell us a bit about yourself!",
        value: `> ${answer3}`,
    }, {
        name: "Have a fursona? Tell us about it!",
        value: `> ${answer4}`,
    }, {
        name: "Have you read the rules?",
        value: `> ${answer5}`,
    }),
    verificationReview: (interaction, guildID, status, age, invite, userCheck1, userCheck2, userCheck3, response1, response2, response3, response4, response5) => new discord_js_1.default.EmbedBuilder()
        .setColor(0xeb716f)
        .setAuthor({
        name: `Verification Application${status}`,
        iconURL: `${interaction.client.guilds.cache.get(guildID)?.iconURL()}`,
    })
        .addFields({
        name: "User Info:",
        value: `> **User Tag:** <@${interaction.user.id}>\n> **User ID:** ||${interaction.user.id}||\n> **Account Age:** <t:${Math.round(interaction.user.createdTimestamp / 1000)}:f>, <t:${Math.round(interaction.user.createdTimestamp / 1000)}:R>` /*`\n> **User Age:** ${age}\n> **Invite Link:** ${invite
                      .split(',')
                      .at(0)}\n> **Joined From:** ${invite.split(',').at(1)}`*/,
    }, {
        name: "User Check:",
        value: `> ${userCheck1}\n> ${userCheck2}\n> ${userCheck3}`,
    }, {
        name: "Reason:",
        value: `> User is under 13 (Banned at verification) | ${interaction.client.guilds.cache.get(guildID)?.name}`,
    })
        .setThumbnail(`${interaction.user.avatarURL()}?size=4096`)
        .setTimestamp(),
    verificationHelp: (client) => new discord_js_1.default.EmbedBuilder()
        .addFields({
        name: "How do I verify?",
        value: `> Check for a DM from <@${client.user.id}> and answer the questions provided.`,
    }, {
        name: "Why haven't I been verified yet?",
        value: "> All verification applications are reviewed manually by our staff, so sometimes it can take a while. **Usually, people are verified within 2 days**. *Please don't ping staff/open tickets about verifying you.*",
    }, {
        name: "Didn't receive a DM?",
        value: "> Make sure your DM's are open. Info on how to do so [here](https://support.discord.com/hc/en-us/articles/217916488-Blocking-Privacy-Settings-). \n > After you open up your DM's, click the \"Resend Verification\" button.",
    })
        .setFooter({
        text: "If you're encountering any issues that can't be solved above, click the \"Open a Ticket\" button to talk with staff.",
    }),
};
// -------------------------------------------------------------------------------
/* Modals */
exports.modal = {
    ticket: new discord_js_1.default.ModalBuilder()
        .setCustomId("ticket")
        .setTitle("Open a Ticket")
        .addComponents(new discord_js_1.default.ActionRowBuilder().addComponents(new discord_js_1.default.TextInputBuilder()
        .setCustomId("ticket1 1")
        .setLabel("What is the reason for this support ticket?")
        .setPlaceholder("Ex. I'm having issues sending images in media")
        .setStyle(discord_js_1.default.TextInputStyle.Paragraph)
        .setMaxLength(1024))),
    verification: (Id) => new discord_js_1.default.ModalBuilder()
        .setCustomId(`verification1,${Id}`)
        .setTitle("Verification Application")
        .addComponents(new discord_js_1.default.ActionRowBuilder().addComponents(new discord_js_1.default.TextInputBuilder()
        .setCustomId("verification1 1")
        .setLabel("How did you find us?")
        .setPlaceholder("Ex. I found your server on Disboard")
        .setStyle(discord_js_1.default.TextInputStyle.Short)
        .setMaxLength(50)), new discord_js_1.default.ActionRowBuilder().addComponents(new discord_js_1.default.TextInputBuilder()
        .setCustomId("verification1 2")
        .setLabel("Why did you join our server?")
        .setPlaceholder("Ex. I want to join your server so I can socialize with a thriving community")
        .setStyle(discord_js_1.default.TextInputStyle.Paragraph)
        .setMaxLength(1024)), new discord_js_1.default.ActionRowBuilder().addComponents(new discord_js_1.default.TextInputBuilder()
        .setCustomId("verification1 3")
        .setLabel("Tell us a bit about yourself!")
        .setPlaceholder("Tell us about your hobbies, interests, and anything else you want to share with us")
        .setStyle(discord_js_1.default.TextInputStyle.Paragraph)
        .setMaxLength(1024)), new discord_js_1.default.ActionRowBuilder().addComponents(new discord_js_1.default.TextInputBuilder()
        .setCustomId("verification1 4")
        .setLabel("Have a fursona? Tell us about it!")
        .setPlaceholder("What species is it? Have a ref? ")
        .setStyle(discord_js_1.default.TextInputStyle.Paragraph)
        .setRequired(false)
        .setMaxLength(1024)), new discord_js_1.default.ActionRowBuilder().addComponents(new discord_js_1.default.TextInputBuilder()
        .setCustomId("verification1 5")
        .setLabel("Have you read the rules?")
        .setStyle(discord_js_1.default.TextInputStyle.Short)
        .setMaxLength(3))),
};
// -------------------------------------------------------------------------------
/* Select Menus */
exports.selectMenu = {};
// -------------------------------------------------------------------------------
/* Webhooks */
exports.webhook = {};
