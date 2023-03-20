import Discord from 'discord.js';
import { PrismaClient } from '@prisma/client';

import Client from '../../classes/client.js';
import Components from '../../classes/components.js';

const prisma = new PrismaClient();

module.exports = {
  name: Discord.Events.GuildMemberAdd,
  async execute(member: Discord.BaseInteraction) {
    await prisma.guild.create({
      data: {
        id: `${member.guild?.id}`,
        settings: {
          verification: {
            isEnabled: true,
            questions: [
              'How did you find us?',
              'paragraph, required',
              'Why did you join our server?',
              'paragraph, required',
              'Tell us a bit about yourself!',
              'paragraph, required',
              'Have a fursona? Tell us about it!',
              'paragraph, required',
              'Have you read the rules?',
              'paragraph, required',
            ],
            role: [1050190889378652200n],
            verificationChannel: 1010210431979233322n,
            verificationLog: 1010210431979233322n,
          },
        },
      },
    });
    if (member.user.bot === true) return;
    const buttons = Components.button.verification[1](member.guild?.id);
    buttons.components.forEach(buttons =>
      buttons.setDisabled(false).setStyle(Discord.ButtonStyle.Secondary)
    );
    await prisma.guild
      .findFirst({
        where: { settings: { verification: { isEnabled: true } } },
      })
      .then(data => {
        console.log(data);
        if (!data) throw (Client.errorCodes.notFound, 'Verification module disabled');
      })
      .then(() =>
        member.user.send({
          embeds: [Components.embed.verification[1](member.user, member.guild)],
          components: [buttons],
        })
      )
      .finally(() => prisma.$disconnect)
      .catch(err => err);
  },
};
