/*import Discord from 'discord.js';
import Logger from './logger';
import path from 'path';
import fs from 'fs';
import { client } from './client';
import CommandComponents from './commandComponents';

// Deploy slash commands
interface Command {
  name: string;
  description: string;
  options?: Discord.ApplicationCommandOption[];
}
//@ts-ignore
const clearCommands: never[] = [];
//@ts-ignore
const globalCommands: Command[] = [];
//@ts-ignore
const guildCommands: Command[] = [];
//@ts-ignore
const fdCommands: Command[] = [];
const commands_Path = path.join(__dirname, '../commands');
const readCommandsDirectory = (dirPath: string, commandsArray: Command[]) => {
  const commandFiles = fs.readdirSync(dirPath);
  for (const commandFile of commandFiles) {
    const commandFilePath = path.join(dirPath, commandFile);
    const commandFileStat = fs.statSync(commandFilePath);
    if (commandFileStat.isDirectory()) {
      readCommandsDirectory(commandFilePath, commandsArray);
    } else if (commandFile.endsWith('.js')) {
      const command = require(commandFilePath);
      if (commandFile.startsWith('_')) {
        guildCommands.push(command.data.toJSON());
      } else {
        commandsArray.push(command.data.toJSON());
      }
    }
  }
};
readCommandsDirectory(commands_Path, globalCommands);
const rest = new Discord.REST({ version: process.env.DISCORD_API_VERSION }).setToken(
  process.env.BOT_TOKEN!
);
(async () => {
  try {
    new Logger(`${client.user?.username}`).info(
      `Started refreshing ${globalCommands.length} global and ${guildCommands.length} slash commands...`
    );
    const globalData: any = await rest.put(
      Discord.Routes.applicationCommands(process.env.BOT_APPLICATION_ID!),
      {
        body: globalCommands,
      }
    );
    const guildData: any = await rest.put(
      Discord.Routes.applicationGuildCommands(
        process.env.BOT_APPLICATION_ID!,
        CommandComponents.floofyDenId
      ),
      {
        body: guildCommands,
      }
    );
    new Logger(`${client.user?.username}`).success(
      `Successfully reloaded ${globalData.length} global and ${guildData.length} slash commands`
    );
  } catch (error) {
    console.error(error);
  }
})();
*/
