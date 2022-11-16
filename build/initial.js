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
exports.client3 =
  exports.client2 =
  exports.client =
  exports.timestamp =
  exports.config =
    void 0;
const chalk_1 = __importDefault(require("chalk")); // CLI Colors
const inquirer_1 = __importDefault(require("inquirer")); // Interactive CLI
const discord_js_1 = __importDefault(require("discord.js")); // Discord API
const mongoose_1 = __importDefault(require("mongoose")); // Database
const dotenv = __importStar(require("dotenv")); // .env File
const yaml_1 = __importDefault(require("yaml")); // .yml File
const node_fs_1 = __importDefault(require("node:fs")); // File System
const node_process_1 = __importDefault(require("node:process"));
// -------------------------------------------------------------------------------
chalk_1.default.level = 3; // Configuring Chalk
dotenv.config({ path: ".env" }); // Configuring Dotenv
exports.config = yaml_1.default.parse(
  // Import The config.yaml File
  node_fs_1.default.readFileSync("src/config/config.yml", "utf8")
);
exports.timestamp = `${
  // Configure the timestamp constant
  new Date().getMonth() + 1
}-${new Date().getDate()}-${new Date().getFullYear()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`;
exports.client = new discord_js_1.default.Client({
  // Configure Main Bot Permissions
  intents: [
    discord_js_1.default.GatewayIntentBits.Guilds,
    discord_js_1.default.GatewayIntentBits.GuildMembers,
    discord_js_1.default.GatewayIntentBits.GuildVoiceStates,
  ],
});
exports.client2 = new discord_js_1.default.Client({
  // Configure Secondary Bot Permissions
  intents: [
    discord_js_1.default.GatewayIntentBits.Guilds,
    discord_js_1.default.GatewayIntentBits.GuildMembers,
    discord_js_1.default.GatewayIntentBits.GuildMessages,
  ],
});
exports.client3 = await mongoose_1.default.connect(process.env.mongoDbUri); // Configure Database Uri
// -------------------------------------------------------------------------------
console.log(
  chalk_1.default.white(exports.timestamp),
  chalk_1.default.underline.magentaBright("Startup"),
  " Booting & connecting to database..."
);
exports.client.login(process.env.floofyHelperToken);
exports.client.once("ready", () => {
  exports.client2.login(process.env.fdVerificationToken);
  exports.client2.once("ready", async () => {
    /*console.log(
            chalk.white(timestamp),
            chalk.underline.magentaBright('Startup'),
            chalk.greenBright(' Connected to database')
        )*/
    inquirer_1.default
      .prompt([
        {
          type: "list",
          message: "Which environment do you want to boot into?",
          name: "environment",
          choices: [
            {
              name: "Development",
            },
            {
              name: "Production",
            },
          ],
        },
      ])
      .then((answers) => {
        if (answers.environment === "Development") {
          inquirer_1.default
            .prompt([
              {
                type: "list",
                message: "Which bot(s) do you want to boot?",
                name: "development",
                choices: [
                  {
                    name: `${exports.client.user?.username}`,
                  },
                  {
                    name: `${exports.client2.user?.username}`,
                  },
                  {
                    name: "All",
                  },
                ],
              },
            ])
            .then((answers) => {
              if (answers.development === `${exports.client.user?.username}`) {
                exports.client2.destroy();
                exports.client2.once("shardDisconnect", () => {
                  Promise.resolve().then(() =>
                    __importStar(require("./floofyHelper/index.js"))
                  );
                  console.log(
                    chalk_1.default.white(exports.timestamp),
                    chalk_1.default.underline.magentaBright("Startup"),
                    ` Starting ${exports.client.user?.username}...`
                  );
                });
              } else if (
                answers.development === `${exports.client2.user?.username}`
              ) {
                exports.client.destroy();
                exports.client.once("shardDisconnect", () => {
                  Promise.resolve().then(() =>
                    __importStar(require("./fdVerification/index.js"))
                  );
                  console.log(
                    chalk_1.default.white(exports.timestamp),
                    chalk_1.default.underline.magentaBright("Startup"),
                    ` Starting ${exports.client2.user?.username}...`
                  );
                });
              } else if (answers.development === "All") {
                Promise.resolve().then(() =>
                  __importStar(require("./floofyHelper/index.js"))
                );
                Promise.resolve().then(() =>
                  __importStar(require("./fdVerification/index.js"))
                );
                console.log(
                  chalk_1.default.white(exports.timestamp),
                  chalk_1.default.underline.magentaBright("Startup"),
                  ` Starting ${exports.client.user?.username} and ${exports.client2.user?.username}...`
                );
              }
            });
        } else if (answers.environment === "Production") {
          inquirer_1.default
            .prompt([
              {
                type: "list",
                message: `Are you sure? ${chalk_1.default.red(
                  "(This will boot the bot to"
                )} ${chalk_1.default.red.underline(
                  "every"
                )} ${chalk_1.default.redBright("server!)")}`,
                name: "production",
                choices: [
                  {
                    name: "No",
                  },
                  {
                    name: "Yes",
                  },
                ],
              },
            ])
            .then((answers) => {
              if (answers.production === "No") {
                console.log(
                  chalk_1.default.yellowBright.bold(
                    "Killing instance, restart bot to deploy"
                  )
                );
                node_process_1.default;
              }
              if (answers.production === "Yes") {
                console.log(
                  chalk_1.default.white(exports.timestamp),
                  chalk_1.default.magentaBright.underline("Startup"),
                  " Please wait..."
                );
                dotenv.config({
                  path: ".env.production",
                  override: true,
                });
                exports.client.destroy();
                exports.client.once("shardDisconnect", () => {
                  exports.client2.destroy();
                  exports.client2.once("shardDisconnect", () => {
                    exports.client.login(process.env.floofyHelperToken);
                    exports.client.once("shardReady", () => {
                      exports.client2.login(process.env.fdVerificationToken);
                      exports.client2.once("shardReady", () => {
                        Promise.resolve().then(() =>
                          __importStar(require("./floofyHelper/index.js"))
                        );
                        Promise.resolve().then(() =>
                          __importStar(require("./fdVerification/index.js"))
                        );
                        console.log(
                          chalk_1.default.white(exports.timestamp),
                          chalk_1.default.underline.magentaBright("Startup"),
                          ` Starting ${exports.client.user?.username} and ${exports.client2.user?.username}...`
                        );
                      });
                    });
                  });
                });
              }
            });
        }
      });
  });
});
