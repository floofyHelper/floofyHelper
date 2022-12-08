import Discord from 'discord.js';
import { PrismaClient } from '@prisma/client';

import Components from '../../classes/components.js';

const prisma = new PrismaClient();

module.exports = {
  name: Discord.Events.GuildMemberAdd,
  async execute(member: Discord.Interaction) {
    if (member.guild?.id === '943404593105231882') return; /* REMOVE THIS BEFORE STAGING */
    if (member.user.bot === true) return;
    const buttons = Components.button.verification[1](member.guild?.id);
    buttons.components.forEach(buttons =>
      buttons.setDisabled(false).setStyle(Discord.ButtonStyle.Secondary)
    );
    Promise.all([
      prisma.guild.upsert({
        where: { id: member.guild?.id },
        create: {
          id: member.guild!.id,
          verification: { create: { id: member.user.id } },
        },
        update: {
          verification: {
            upsert: {
              where: { id: member.user.id },
              create: { id: member.user.id },
              update: {},
            },
          },
        },
      }),
      member.user.send({
        embeds: [Components.embed.verification[1](member.user, member.guild)],
        components: [buttons],
      }),
    ]).finally(() => prisma.$disconnect);
  },
};
