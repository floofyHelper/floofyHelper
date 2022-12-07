import Discord from 'discord.js';
import { PrismaClient } from '@prisma/client';

import Components from '../../classes/components.js';
import * as functions from '../../classes/functions.js';

const prisma = new PrismaClient();

module.exports = {
  name: Discord.Events.GuildMemberAdd,
  async execute(member: Discord.Interaction) {
    try {
      if (member.guild?.id === '943404593105231882') return; /* REMOVE THIS BEFORE STAGING */
      if (member.user.bot === true) return;
      const buttons = Components.button.verification[1](member.guild?.id);
      buttons.components.forEach(buttons => {
        buttons.setDisabled(false).setStyle(Discord.ButtonStyle.Secondary);
      });
      // Adding guild & verification data to database
      await prisma.guild
        .upsert({
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
        })
        .finally(() => {
          prisma.$disconnect;
        });
      // Sending first verification embed to user
      await member.user.send({
        embeds: [Components.embed.verification[1](member.user, member.guild)],
        components: [buttons],
      });
    } catch (err) {
      await functions.sendToErrorLog(err, member);
    }
  },
};
