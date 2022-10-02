import chalk from 'chalk'
import { timestamp, config, client2 as client } from '../initial.js'
console.log(
	chalk.white(timestamp),
	chalk.underline.magentaBright('Startup'),
	` ${client.user?.username} files found, starting bot...`
)
import Discord from 'discord.js' // Discord API
import fs from 'node:fs' // File System
import path from 'node:path'
import { button, embed, modal, selectMenu } from './components.js'
import('./deployCommands.js')

// -------------------------------------------------------------------------------

client.on('guildMemberAdd', async (member) => {
	if (member.user.bot === false) {
		button.verification.components[0]
			.setDisabled(false)
			.setStyle(Discord.ButtonStyle.Secondary)
		button.verification.components[1]
			.setDisabled(false)
			.setStyle(Discord.ButtonStyle.Secondary)
		button.verification.components[2]
			.setDisabled(false)
			.setStyle(Discord.ButtonStyle.Secondary)
		button.verification.components[3]
			.setDisabled(false)
			.setStyle(Discord.ButtonStyle.Secondary)
		await member.send({
			embeds: [embed.verification(member)],
			components: [button.verification],
		})
	}
})

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isButton()) return
	if (interaction.customId === 'verification 1') {
		button.verification.components[0]
			.setDisabled(true)
			.setStyle(Discord.ButtonStyle.Primary)
		button.verification.components[1]
			.setDisabled(true)
			.setStyle(Discord.ButtonStyle.Secondary)
		button.verification.components[2]
			.setDisabled(true)
			.setStyle(Discord.ButtonStyle.Secondary)
		button.verification.components[3]
			.setDisabled(true)
			.setStyle(Discord.ButtonStyle.Secondary)
		await interaction.update({
			components: [button.verification],
		})
		await interaction.user.send({
			embeds: [embed.under13],
			components: [button.under13],
		})
		await interaction.client.guilds.cache
			.at(0)
			?.members.kick(
				`${interaction.user.id}`,
				`User is under 13 | ${
					interaction.client.guilds.cache.at(0)?.name
				}`
			)
		const channel = client.channels.cache.get('1010210431979233322')
		if (channel?.isTextBased()) {
			await channel.send({
				embeds: [embed.verificationReview(interaction)],
			})
		}
	}

	if (interaction.customId === 'verification 2') {
		button.verification.components[0]
			.setDisabled(true)
			.setStyle(Discord.ButtonStyle.Secondary)
		button.verification.components[1]
			.setDisabled(true)
			.setStyle(Discord.ButtonStyle.Primary)
		button.verification.components[2]
			.setDisabled(true)
			.setStyle(Discord.ButtonStyle.Secondary)
		button.verification.components[3]
			.setDisabled(true)
			.setStyle(Discord.ButtonStyle.Secondary)
		await interaction.showModal(modal.verification)
	}

	if (interaction.customId === 'verification 3') {
		button.verification.components[0]
			.setDisabled(true)
			.setStyle(Discord.ButtonStyle.Secondary)
		button.verification.components[1]
			.setDisabled(true)
			.setStyle(Discord.ButtonStyle.Secondary)
		button.verification.components[2]
			.setDisabled(true)
			.setStyle(Discord.ButtonStyle.Primary)
		button.verification.components[3]
			.setDisabled(true)
			.setStyle(Discord.ButtonStyle.Secondary)
		await interaction.showModal(modal.verification)
	}

	if (interaction.customId === 'verification 4') {
		button.verification.components[0]
			.setDisabled(true)
			.setStyle(Discord.ButtonStyle.Secondary)
		button.verification.components[1]
			.setDisabled(true)
			.setStyle(Discord.ButtonStyle.Secondary)
		button.verification.components[2]
			.setDisabled(true)
			.setStyle(Discord.ButtonStyle.Secondary)
		button.verification.components[3]
			.setDisabled(true)
			.setStyle(Discord.ButtonStyle.Primary)
		await interaction.showModal(modal.verification)
	}

	if (interaction.customId === 'verification2 1') {
		await interaction.deferUpdate()
		await interaction.message.delete()
		await interaction.user.send({
			embeds: [embed.verification3],
		})
	}

	if (interaction.customId === 'verification2 2') {
		if (interaction.user.bot === false) {
			button.verification.components[0]
				.setDisabled(false)
				.setStyle(Discord.ButtonStyle.Secondary)
			button.verification.components[1]
				.setDisabled(false)
				.setStyle(Discord.ButtonStyle.Secondary)
			button.verification.components[2]
				.setDisabled(false)
				.setStyle(Discord.ButtonStyle.Secondary)
			button.verification.components[3]
				.setDisabled(false)
				.setStyle(Discord.ButtonStyle.Secondary)
			await interaction.deferUpdate()
			await interaction.user.send({
				embeds: [embed.verification(interaction)],
				components: [button.verification],
			})
		}
	}

	if (interaction.customId === 'verificationHelp 1') {
		await interaction.showModal(modal.ticket)
	}

	if (interaction.customId === 'verificationHelp 2') {
		if (interaction.user.bot === false) {
			button.verification.components[0]
				.setDisabled(false)
				.setStyle(Discord.ButtonStyle.Secondary)
			button.verification.components[1]
				.setDisabled(false)
				.setStyle(Discord.ButtonStyle.Secondary)
			button.verification.components[2]
				.setDisabled(false)
				.setStyle(Discord.ButtonStyle.Secondary)
			button.verification.components[3]
				.setDisabled(false)
				.setStyle(Discord.ButtonStyle.Secondary)
			await interaction.deferUpdate()
			await interaction.user
				.send({
					embeds: [embed.verificationHelp2(interaction)],
					components: [button.verification],
				})
				.catch(console.error)
		}
	}
	client.on('error', (async) => {})
})

client.on('interactionCreate', async (interaction) => {
	if (interaction.type !== Discord.InteractionType.ModalSubmit) return
	if (interaction.customId === 'verification') {
		if (interaction.isFromMessage()) {
			interaction.update({
				components: [button.verification],
			})
		}
		interaction.user.send({
			embeds: [embed.verification2(interaction)],
			components: [button.verification2],
		})
	}
})

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return
	const { commandName } = interaction
	if (commandName === 'help') {
		await interaction.reply({
			embeds: [embed.verificationHelp],
			components: [button.verificationHelp],
			ephemeral: true,
		})
	}
})

// -------------------------------------------------------------------------------

console.log(
	chalk.white(timestamp),
	chalk.underline.magentaBright('Startup'),
	chalk.greenBright(` ${client.user?.tag} is logged in`)
)
/*	client.user.setPresence({
		activities: [{ name: `${client.guild.memberCount} users`, type: Discord.ActivityType.Watching }],
		status: 'online',
	})
})	*/
