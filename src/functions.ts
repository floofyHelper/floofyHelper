import { client } from './initial.js';

import Client from './classes/client.js';
import Logger from './classes/logger.js';

const embed = Client.embed;
const button = Client.button;

export function consoleLogError(err: any) {
  new Logger('Server').error(err);
}

export async function forumCheckForExistingThreadThenLog(
  forumChannelId: string,
  threadAuthorId: string,
  threadName: string,
  threadDescription: string,
  messageComponents: any
) {
  try {
    // Checks to see if there is an already existing forum thread. If not, create one
    const channel: any = client.channels.cache.get(forumChannelId);
    channel.threads.fetch().then(async (collection: any) => {
      if (client.user?.id !== threadAuthorId) return;
      const thread = collection.threads.find((array: any) => {
        return array.name === threadName;
      });
      const isAuthor = collection.threads.some((array: any) => {
        return array.ownerId === threadAuthorId;
      });
      if (thread === undefined || (thread instanceof Object === true && isAuthor === false)) {
        await channel.threads.create({
          name: threadName,
          message: {
            content: threadDescription,
          },
        });
      }
      // Log message in channel
      channel.threads.fetch().then(async (collection: any, thread: any) => {
        if (client.user?.id !== threadAuthorId) return;
        const newCollection = collection.threads.find((array: any) => {
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

export async function sendToErrorLog(err: any, interaction: any) {
  try {
    // Send error embed to user
    await interaction.user.send({
      embeds: [embed.error],
      components: [button.error],
      ephemeral: true,
    });
    // Log error in error logging channel
    await forumCheckForExistingThreadThenLog(
      process.env.ERR_LOG!,
      '989979801894912040', // CHANGE TO MAIN BOT ID BEFORE STAGING
      '🛑 Error Log',
      '## <:myBots:1001930208393314334> This channel is used to inform devs of errors with <@!953794936736727110>\n\n- Follow this channel to receive alerts',
      {
        content: '||<@&1038965218581160006>||',
        embeds: [embed.error],
      }
    );
    // Log error in console
    consoleLogError(err);
  } catch (err) {
    consoleLogError(err);
  }
}
