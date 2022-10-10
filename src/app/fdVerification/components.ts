import Discord, { ModalActionRowComponentBuilder } from 'discord.js'

export const button: any = {
	verification: new Discord.ActionRowBuilder() //
		.addComponents(
			new Discord.ButtonBuilder()
				.setCustomId('verification 1')
				.setLabel('Under 13')
				.setStyle(Discord.ButtonStyle.Secondary)
		)
		.addComponents(
			new Discord.ButtonBuilder()
				.setCustomId('verification 2')
				.setLabel('13-15')
				.setStyle(Discord.ButtonStyle.Secondary)
		)
		.addComponents(
			new Discord.ButtonBuilder()
				.setCustomId('verification 3')
				.setLabel('16-17')
				.setStyle(Discord.ButtonStyle.Secondary)
		)
		.addComponents(
			new Discord.ButtonBuilder()
				.setCustomId('verification 4')
				.setLabel('18+')
				.setStyle(Discord.ButtonStyle.Secondary)
		),

	verification2: new Discord.ActionRowBuilder() //
		.addComponents(
			new Discord.ButtonBuilder()
				.setCustomId('verification2 1')
				.setLabel('Submit')
				.setStyle(Discord.ButtonStyle.Success)
		)
		.addComponents(
			new Discord.ButtonBuilder()
				.setCustomId('verification2 2')
				.setLabel('Restart')
				.setStyle(Discord.ButtonStyle.Secondary)
		),

	under13: new Discord.ActionRowBuilder() //
		.addComponents(
			new Discord.ButtonBuilder()
				.setLabel('Discord Age Requirements')
				.setURL('https://discord.com/terms#2')
				.setStyle(Discord.ButtonStyle.Link)
		),

	verificationReview: new Discord.ActionRowBuilder() //
		.addComponents(
			new Discord.ButtonBuilder()
				.setCustomId('verificationReview 1')
				.setLabel('Approve')
				.setStyle(Discord.ButtonStyle.Success)
		)
		.addComponents(
			new Discord.ButtonBuilder()
				.setCustomId('verificationReview 2')
				.setLabel('Deny')
				.setStyle(Discord.ButtonStyle.Danger)
		)
		.addComponents(
			new Discord.ButtonBuilder()
				.setCustomId('verificationReview 3')
				.setLabel('Question')
				.setStyle(Discord.ButtonStyle.Secondary)
		)
		.addComponents(
			new Discord.ButtonBuilder()
				.setCustomId('verificationReview 4')
				.setLabel('More Options')
				.setStyle(Discord.ButtonStyle.Secondary)
		),

	verificationHelp: new Discord.ActionRowBuilder() //
		.addComponents(
			new Discord.ButtonBuilder()
				.setCustomId('verificationHelp 1')
				.setLabel('Open a Ticket')
				.setStyle(Discord.ButtonStyle.Primary)
				.setEmoji('🎟️')
		)
		.addComponents(
			new Discord.ButtonBuilder()
				.setCustomId('verificationHelp 2')
				.setLabel('Resend Verification')
				.setStyle(Discord.ButtonStyle.Secondary)
				.setEmoji('📨')
		),
}

// -------------------------------------------------------------------------------

export const embed: any = {
	verification: (member: any) =>
		new Discord.EmbedBuilder()
			.setAuthor({
				name: `Welcome ${member.displayName} to ${member.guild}!`,
				iconURL: `${member.guild.iconURL()}`,
			})
			.setDescription(
				"Before you can access the server, we need you to answer some questions to make sure this server is a good fit for you. Whenever you're ready, please start below. \n \n > Please select your age group below to verify your account. \n > **Lying about your age will result in a ban.**"
			),

	verification2: (interaction: any) =>
		new Discord.EmbedBuilder()
			.setAuthor({
				name: 'Look over your application, want to change anything?',
			})
			.addFields(
				{
					name: 'How did you find us?',
					value: `${interaction.fields.getTextInputValue(
						'verificationReason1'
					)}`,
				},
				{
					name: 'Why did you join our server?',
					value: `${interaction.fields.getTextInputValue(
						'verificationReason2'
					)}`,
				},
				{
					name: 'Tell us a bit about yourself!',
					value: `${interaction.fields.getTextInputValue(
						'verificationReason3'
					)}`,
				},
				{
					name: 'Have a fursona? Tell us about it!',
					value: `${interaction.fields.getTextInputValue(
						'verificationReason4'
					)}`,
				},
				{
					name: 'Have you read the rules?',
					value: `${interaction.fields.getTextInputValue(
						'verificationReason5'
					)}`,
				}
			),

	verification3: new Discord.EmbedBuilder() //
		.setColor(0x69d09a)
		.setAuthor({
			name: 'Verification application sent!',
			iconURL:
				'https://cdn.discordapp.com/emojis/1015719865572667625.webp?size=96&quality=lossless',
		})
		.setDescription(
			"> All verification applications are reviewed manually by our staff, so sometimes it can take a while. **Usually, people are verified within 2 days.** *Please don't ping staff/open tickets about verifying you.*"
		),

	under13: new Discord.EmbedBuilder() //
		.setColor(0xeb716f)
		.setAuthor({
			name: "As per Discord's ToS, you must be at least 13 years old to join this server.",
			iconURL:
				'https://cdn.discordapp.com/emojis/1015719863446151198.webp?size=240&quality=lossless',
		}),

	verificationReview: (interaction: any) =>
		new Discord.EmbedBuilder()
			.setColor(0xeb716f)
			.setAuthor({
				name: 'Verification Application (Kicked)',
				iconURL: `${interaction.client.guilds.cache.at(0)?.iconURL()}`,
			})
			.addFields(
				{
					name: 'User Info:',
					value: `> **User Tag:** <@${
						interaction.user.id
					}>\n> **User ID:** ||${
						interaction.user.id
					}||\n> **Account Age:** <t:${Math.round(
						interaction.user.createdTimestamp / 1000
					)}:f>, <t:${Math.round(
						interaction.user.createdTimestamp / 1000
					)}:R>\n> **User Age:** Under 13\n> **Invite Link:** \`null\`\n> **Joined From:** \`null\``,
				},
				{
					name: 'User Check:',
					value: '> <:Check:1015719865572667625> Account age older than 2 weeks\n> <:Check:1015719865572667625> User read/agreed to rules\n> <:Cross:1015719863446151198> Account not trusted **(User is under 13)**',
				},
				{
					name: 'Reason:',
					value: `> User is under 13 (Banned at verification) | ${
						interaction.client.guilds.cache.at(0)?.name
					}`,
				}
			)
			.setThumbnail(`${interaction.user.avatarURL()}?size=4096`)
			.setTimestamp(),

	verificationHelp: new Discord.EmbedBuilder()
		.addFields(
			{
				name: 'How do I verify?',
				value: '> Check for a DM from <@1000994713333153893> and answer the questions provided.',
			},
			{
				name: "Why haven't I been verified yet?",
				value: "> All verification applications are reviewed manually by our staff, so sometimes it can take a while. **Usually, people are verified within 2 days**. *Please don't ping staff/open tickets about verifying you.*",
			},
			{
				name: "Didn't receive a DM?",
				value: '> Make sure your DM\'s are open. Info on how to do so [here](https://support.discord.com/hc/en-us/articles/217916488-Blocking-Privacy-Settings-). \n > After you open up your DM\'s, click the "Resend Verification" button.',
			}
		)
		.setFooter({
			text: 'If you\'re encountering any issues that can\'t be solved above, click the "Open a Ticket" button to talk with staff.',
		}),
}

// -------------------------------------------------------------------------------

export const modal: any = {
	ticket: new Discord.ModalBuilder()
		.setCustomId('ticket')
		.setTitle('Open a Ticket')
		.addComponents(
			new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				new Discord.TextInputBuilder()
					.setCustomId('ticketReason1')
					.setLabel('What is the reason for this support ticket?')
					.setPlaceholder(
						"Ex. I'm having issues sending images in media"
					)
					.setStyle(Discord.TextInputStyle.Paragraph)
					.setMaxLength(1024)
			)
		),

	verification: new Discord.ModalBuilder()
		.setCustomId('verification')
		.setTitle('Verification Application')
		.addComponents(
			new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				new Discord.TextInputBuilder()
					.setCustomId('verificationReason1')
					.setLabel('How did you find us?')
					.setPlaceholder('Ex. I found your server on Disboard')
					.setStyle(Discord.TextInputStyle.Short)
					.setMaxLength(50)
			),
			new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				new Discord.TextInputBuilder()
					.setCustomId('verificationReason2')
					.setLabel('Why did you join our server?')
					.setPlaceholder(
						'Ex. I want to join your server so I can socialize with a thriving community'
					)
					.setStyle(Discord.TextInputStyle.Paragraph)
					.setMaxLength(1024)
			),
			new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				new Discord.TextInputBuilder()
					.setCustomId('verificationReason3')
					.setLabel('Tell us a bit about yourself!')
					.setPlaceholder(
						'Tell us about your hobbies, interests, and anything else you want to share with us'
					)
					.setStyle(Discord.TextInputStyle.Paragraph)
					.setMaxLength(1024)
			),
			new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				new Discord.TextInputBuilder()
					.setCustomId('verificationReason4')
					.setLabel('Have a fursona? Tell us about it!')
					.setPlaceholder('What species is it? Have a ref? ')
					.setStyle(Discord.TextInputStyle.Paragraph)
					.setRequired(false)
					.setMaxLength(1024)
			),
			new Discord.ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
				new Discord.TextInputBuilder()
					.setCustomId('verificationReason5')
					.setLabel('Have you read the rules?')
					.setStyle(Discord.TextInputStyle.Short)
					.setMaxLength(3)
			)
		),
}

// -------------------------------------------------------------------------------

export const selectMenu: any = {}