import Discord from 'discord.js';
import { PrismaClient } from '@prisma/client';

import Client from '../../classes/client.js';
import Components from '../../classes/components.js';

const prisma = new PrismaClient();

module.exports = {
  name: Discord.Events.GuildMemberAdd,
  async execute(member: Discord.BaseInteraction) {
    if (member.user.bot === true) return;
    const buttons = Components.button.verification[1](member.guild?.id);
    buttons.components.forEach(buttons =>
      buttons.setDisabled(false).setStyle(Discord.ButtonStyle.Secondary)
    );
    await prisma.guild
      .findFirst({
        where: {
          id: member.guild?.id,
          settings: { is: { verification: { is: { isEnabled: true } } } },
        },
      })
      .then(data => {
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
