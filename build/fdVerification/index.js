"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const initial_js_1 = require("../initial.js");
console.log(
  chalk_1.default.white(initial_js_1.timestamp),
  chalk_1.default.underline.magentaBright("Startup"),
  ` ${initial_js_1.client2.user?.username} files found, starting bot...`
);
const discord_js_1 = __importDefault(require("discord.js")); // Discord API
const components_js_1 = require("./components.js");
Promise.resolve().then(() => __importStar(require("./deployCommands.js")));
// -------------------------------------------------------------------------------
function consoleLogError(err) {
  console.error(
    chalk_1.default.white(initial_js_1.timestamp),
    chalk_1.default.underline.blueBright(initial_js_1.client2.user?.username),
    " ",
    err
  );
}
async function forumCheckForExistingThreadThenLog(
  forumChannelId,
  threadAuthorId,
  threadName,
  threadDescription,
  messageComponents
) {
  try {
    // Checks to see if there is an already existing forum thread. If not, create one
    const channel = initial_js_1.client2.channels.cache.get(forumChannelId);
    channel.threads.fetch().then(async (collection) => {
      if (initial_js_1.client2.user?.id !== threadAuthorId) return;
      const thread = collection.threads.find((array) => {
        return array.name === threadName;
      });
      const isAuthor = collection.threads.some((array) => {
        return array.ownerId === threadAuthorId;
      });
      if (
        thread === undefined ||
        (thread instanceof Object === true && isAuthor === false)
      ) {
        await channel.threads.create({
          name: threadName,
          message: {
            content: threadDescription,
          },
        });
      }
      // Log message in channel
      channel.threads.fetch().then(async (collection, thread) => {
        if (initial_js_1.client2.user?.id !== threadAuthorId) return;
        const newCollection = collection.threads.find((array) => {
          return array.name === threadName;
        });
        if (thread === undefined) {
          await newCollection.send(messageComponents);
        } else {
          await thread.send(messageComponents);
        }
      });
    });
  } catch (err) {
    consoleLogError(err);
  }
}
async function sendToErrorLog(err, interaction) {
  try {
    // Send error embed to user
    await interaction.user.send({
      embeds: [components_js_1.embed.error],
      components: [components_js_1.button.error],
      ephemeral: true,
    });
    // Log error in error logging channel
    await forumCheckForExistingThreadThenLog(
      process.env.errorLog,
      "989979801894912040", // CHANGE TO MAIN BOT ID BEFORE STAGING
      "🛑 Error Log",
      "## <:myBots:1001930208393314334> This channel is used to inform devs of errors with <@!953794936736727110>\n\n- Follow this channel to receive alerts",
      {
        content: "||<@&1038965218581160006>||",
        embeds: [components_js_1.embed.errorLog(err)],
      }
    );
    // Log error in console
    consoleLogError(err);
  } catch (err) {
    consoleLogError(err);
  }
}
// -------------------------------------------------------------------------------
initial_js_1.client2.on("guildMemberAdd", async (member) => {
  try {
    if (member.guild.id === "943404593105231882")
      return; /* REMOVE THIS BEFORE STAGING */
    if (member.user.bot === true) return;
    const buttons = components_js_1.button.verification(member.guild.id);
    buttons.components[0]
      .setDisabled(false)
      .setStyle(discord_js_1.default.ButtonStyle.Secondary);
    buttons.components[1]
      .setDisabled(false)
      .setStyle(discord_js_1.default.ButtonStyle.Secondary);
    buttons.components[2]
      .setDisabled(false)
      .setStyle(discord_js_1.default.ButtonStyle.Secondary);
    buttons.components[3]
      .setDisabled(false)
      .setStyle(discord_js_1.default.ButtonStyle.Secondary);
    // Adding guild & verification data to database
    await initial_js_1.client3
      .db("BaseInteraction")
      .collection("guild")
      .updateOne(
        { _id: member.guild.id },
        {
          $set: {
            name: member.guild.name,
            verification: {
              [member.user.id]: {
                username: member.user.username,
              },
            },
          },
        },
        { upsert: true }
      );
    // Sending first verification embed to user
    await member.send({
      embeds: [components_js_1.embed.verification(member.user, member.guild)],
      components: [buttons],
    });
  } catch (err) {
    await sendToErrorLog(err, member);
  }
});
initial_js_1.client2.on("interactionCreate", async (interaction) => {
  if (!interaction.isButton()) return;
  try {
    if (interaction.customId.startsWith("verification1 1")) {
      console.log(interaction);
      interaction.message.delete();
      await interaction.user.send({
        embeds: [components_js_1.embed.under13],
        components: [components_js_1.button.under13],
      });
      const guildId = interaction.customId.split(",").at(1);
      await interaction.client.guilds.cache
        .get(guildId)
        ?.members.kick(
          `${interaction.user.id}`,
          `User is under 13 | ${
            interaction.client.guilds.cache.get(guildId)?.name
          }`
        );
      const channel = initial_js_1.client2.channels.cache.get(
        initial_js_1.config.testing.verificationChannel
      );
      if (channel?.isTextBased()) {
        await channel.send({
          embeds: [
            components_js_1.embed.verificationReview(interaction, guildId),
          ],
        });
      }
    }
    if (interaction.customId.startsWith("verification1 2")) {
      const Id = interaction.customId.split(",");
      Id.shift();
      Id.push(`2,${interaction.message.id}`);
      await interaction.showModal(components_js_1.modal.verification(Id));
    }
    if (interaction.customId.startsWith("verification1 3")) {
      const Id = interaction.customId.split(",");
      Id.shift();
      Id.push(`3,${interaction.message.id}`);
      await interaction.showModal(components_js_1.modal.verification(Id));
    }
    if (interaction.customId.startsWith("verification1 4")) {
      const Id = interaction.customId.split(",");
      Id.shift();
      Id.push(`4,${interaction.message.id}`);
      await interaction.showModal(components_js_1.modal.verification(Id));
    }
    if (interaction.customId.startsWith("verification2 1")) {
      await interaction.deferUpdate();
      const message = initial_js_1.client2.users.cache
        .get(interaction.user.id)
        ?.dmChannel?.messages.cache.get(interaction.customId.split(",").at(3));
      await interaction.message.delete();
      await message?.delete();
      // Age
      let age = undefined;
      if (interaction.customId.split(",").at(2) === "2") {
        age = "13-15";
      }
      if (interaction.customId.split(",").at(2) === "3") {
        age = "16-17";
      }
      if (interaction.customId.split(",").at(2) === "4") {
        age = "18+";
      }
      const guildId = interaction.customId.split(",").at(1);
      /*await data
                .db('BaseInteraction')
                .collection('guild')
                .findOne({ _id: guildId })

                    console.log(test)
                })*/
      // SENDING EMBED TO VERIFICATION CHANNEL
      const channelId = await initial_js_1.client3
        .db("BaseInteraction")
        .collection("guild")
        .findOne({
          _id: guildId,
        })
        .then((data) => {
          console.log(
            data?.verification /*Dont know what to do after this point*/
          );
        });
      //await channelId.forEach(console.dir)
      /*await channel.send({
                embeds: [
                    embed.verificationReview(interaction, guildId, null, age),
                ],
            })*/
    }
    if (interaction.customId.startsWith("verification2 2")) {
      if (interaction.user.bot === false) {
        await interaction.deferUpdate();
        const id = interaction.customId.split(",").at(1);
        const buttons = components_js_1.button.verification(id);
        buttons.components[0]
          .setDisabled(false)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        buttons.components[1]
          .setDisabled(false)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        buttons.components[2]
          .setDisabled(false)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        buttons.components[3]
          .setDisabled(false)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        const id2 = interaction.customId.split(",").at(3);
        const message = initial_js_1.client2.users.cache
          .get(interaction.user.id)
          ?.dmChannel?.messages.cache.get(id2);
        await interaction.message.delete();
        await message?.delete();
        await interaction.user.send({
          embeds: [
            components_js_1.embed.verification(
              interaction.user,
              initial_js_1.client2.guilds.cache.get(id)
            ),
          ],
          components: [buttons],
        });
      }
    }
    if (interaction.customId === "verificationHelp 1") {
      await interaction.showModal(components_js_1.modal.ticket);
    }
    if (interaction.customId === "verificationHelp 2") {
      if (interaction.user.bot === false) {
        components_js_1.button.verification.components[0]
          .setDisabled(false)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        components_js_1.button.verification.components[1]
          .setDisabled(false)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        components_js_1.button.verification.components[2]
          .setDisabled(false)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        components_js_1.button.verification.components[3]
          .setDisabled(false)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        await interaction.deferUpdate();
        if (interaction.guild?.name === undefined) {
        } else {
          await interaction.user.send({
            embeds: [
              components_js_1.embed.verification(
                interaction.user,
                interaction.guild
              ),
            ],
            components: [components_js_1.button.verification],
          });
        }
      }
    }
  } catch (err) {
    await sendToErrorLog(err, interaction);
  }
});
initial_js_1.client2.on("interactionCreate", async (interaction) => {
  if (interaction.type !== discord_js_1.default.InteractionType.ModalSubmit)
    return;
  try {
    if (interaction.customId.startsWith("verification1")) {
      const buttons = components_js_1.button.verification();
      if (interaction.customId.split(",").at(2) === "2") {
        buttons.components[0]
          .setDisabled(true)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        buttons.components[1]
          .setDisabled(true)
          .setStyle(discord_js_1.default.ButtonStyle.Primary);
        buttons.components[2]
          .setDisabled(true)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        buttons.components[3]
          .setDisabled(true)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        if (interaction.isFromMessage()) {
          interaction.update({
            components: [buttons],
          });
        }
      }
      if (interaction.customId.split(",").at(2) === "3") {
        buttons.components[0]
          .setDisabled(true)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        buttons.components[1]
          .setDisabled(true)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        buttons.components[2]
          .setDisabled(true)
          .setStyle(discord_js_1.default.ButtonStyle.Primary);
        buttons.components[3]
          .setDisabled(true)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        if (interaction.isFromMessage()) {
          interaction.update({
            components: [buttons],
          });
        }
      }
      if (interaction.customId.split(",").at(2) === "4") {
        buttons.components[0]
          .setDisabled(true)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        buttons.components[1]
          .setDisabled(true)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        buttons.components[2]
          .setDisabled(true)
          .setStyle(discord_js_1.default.ButtonStyle.Secondary);
        buttons.components[3]
          .setDisabled(true)
          .setStyle(discord_js_1.default.ButtonStyle.Primary);
        if (interaction.isFromMessage()) {
          interaction.update({
            components: [buttons],
          });
        }
      }
      const id = interaction.customId.split(",");
      id.shift();
      const guildId = initial_js_1.client2.guilds.cache.get(
        interaction.customId.split(",").at(1)
      );
      interaction.user
        .send({
          embeds: [
            components_js_1.embed.verification2(
              interaction,
              guildId?.iconURL()
            ),
          ],
          components: [components_js_1.button.verification2(id)],
        })
        .catch(console.error);
      // Sending modal submissions to database
      await initial_js_1.client3
        .db("BaseInteraction")
        .collection("guild")
        .updateOne(
          { _id: guildId?.id },
          {
            $set: {
              name: guildId?.name,
              verification: {
                [interaction.user.id]: {
                  username: interaction.user.username,
                  modalSubmissions: [
                    interaction.fields.getTextInputValue("verification1 1"),
                    interaction.fields.getTextInputValue("verification1 2"),
                    interaction.fields.getTextInputValue("verification1 3"),
                    interaction.fields.getTextInputValue("verification1 4"),
                    interaction.fields.getTextInputValue("verification1 5"),
                  ],
                },
              },
            },
          },
          { upsert: true }
        );
    }
  } catch (err) {
    await sendToErrorLog(err, interaction);
  }
});
initial_js_1.client2.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  try {
    const { commandName } = interaction;
    if (commandName === "help") {
      await interaction.reply({
        embeds: [components_js_1.embed.verificationHelp(initial_js_1.client2)],
        components: [components_js_1.button.verificationHelp],
        ephemeral: true,
      });
    }
  } catch (err) {
    await sendToErrorLog(err, interaction);
  }
});
// -------------------------------------------------------------------------------
console.log(
  chalk_1.default.white(initial_js_1.timestamp),
  chalk_1.default.underline.magentaBright("Startup"),
  chalk_1.default.greenBright(` ${initial_js_1.client2.user?.tag} is logged in`)
);
/*client.user?.setPresence({
        activities: [{ name: `${client.guild.memberCount} users`, type: Discord.ActivityType.Watching }],
        status: 'online',
    })*/
