"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const discord_js_1 = __importDefault(require("discord.js")); // Discord API
const rest_1 = require("@discordjs/rest");
const initial_js_1 = require("../initial.js");
// -------------------------------------------------------------------------------
const deleteSlashCommands = [];
const commands = [
    new discord_js_1.default.SlashCommandBuilder()
        /* Staff / Commands */
        .setName('staff')
        .setDescription('All staff commands for verification')
        .setDMPermission(false)
        .addSubcommandGroup(subcommandGroup => subcommandGroup
        .setName('verification')
        .setDescription('Verification commands')
        .addSubcommand(subcommand => subcommand
        .setName('resend')
        .setDescription('Resend verification to a user')
        .addUserOption(option => option
        .setName('user')
        .setDescription('The user you want to resend the verification application to')
        .setRequired(true)))),
    new discord_js_1.default.SlashCommandBuilder()
        .setName('help')
        .setDescription('Having issues with verification?')
        .setDMPermission(false),
];
const rest = new rest_1.REST({ version: initial_js_1.config.discordAPIVersion }).setToken(process.env.fdVerificationToken);
rest
    .put(discord_js_1.default.Routes.applicationCommands(process.env.fdVerificationClientID), { body: commands })
    .then(() => console.log(chalk_1.default.white(initial_js_1.timestamp), chalk_1.default.underline.blueBright(initial_js_1.client2.user?.username), chalk_1.default.greenBright(' Successfully registered slash commands')))
    .catch(console.error);
