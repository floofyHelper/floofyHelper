import chalk from 'chalk'
import { timestamp, config, client2 as client } from '../initial.js'
console.log(
	chalk.white(timestamp),
	chalk.underline.magentaBright('Startup'),
	` ${client.user?.username} files found, starting bot...`
)
import Discord, {
	BaseInteraction,
	BaseManager,
	DMChannel,
	Message,
	MessageManager,
} from 'discord.js' // Discord API
import fs from 'node:fs' // File System
import path from 'node:path'
import { button, embed, modal, selectMenu } from './components.js'
import('./deployCommands.js')

// -------------------------------------------------------------------------------

client.on('guildMemberAdd', async (member) => {
	if (member.guild.id === '943404593105231882')
		return /* REMOVE THIS BEFORE STAGING */
	if (member.user.bot === false) {
		const buttons = button.verification(member.guild.id)
		buttons.components[0]
			.setDisabled(false)
			.setStyle(Discord.ButtonStyle.Secondary)
		buttons.components[1]
			.setDisabled(false)
			.setStyle(Discord.ButtonStyle.Secondary)
		buttons.components[2]
			.setDisabled(false)
			.setStyle(Discord.ButtonStyle.Secondary)
		buttons.components[3]
			.setDisabled(false)
			.setStyle(Discord.ButtonStyle.Secondary)
		await member.send({
			embeds: [embed.verification(member.user, member.guild)],
			components: [buttons],
		})
	}
})

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isButton()) return
	if (interaction.customId.startsWith('verification1 1')) {
		interaction.message.delete()
		await interaction.user.send({
			embeds: [embed.under13],
			components: [button.under13],
		})
		const guildID: any = interaction.customId.split(',').at(1)
		await interaction.client.guilds.cache
			.get(guildID)
			?.members.kick(
				`${interaction.user.id}`,
				`User is under 13 | ${
					interaction.client.guilds.cache.get(guildID)?.name
				}`
			)
		const channel = client.channels.cache.get(
			config.testing.verificationChannel
		)
		if (channel?.isTextBased()) {
			await channel.send({
				embeds: [embed.verificationReview(interaction, guildID)],
			})
		}
	}

	if (interaction.customId.startsWith('verification1 2')) {
		const Id = interaction.customId.split(',')
		Id.shift()
		Id.push('2')
		Id.push(interaction.message.id)
		await interaction.showModal(modal.verification(Id))
	}

	if (interaction.customId.startsWith('verification1 3')) {
		const Id = interaction.customId.split(',')
		Id.shift()
		Id.push('3')
		Id.push(interaction.message.id)
		await interaction.showModal(modal.verification(Id))
	}

	if (interaction.customId.startsWith('verification1 4')) {
		const Id = interaction.customId.split(',')
		Id.shift()
		Id.push('4')
		Id.push(interaction.message.id)
		await interaction.showModal(modal.verification(Id))
	}

	if (interaction.customId.startsWith('verification2 1')) {
		await interaction.deferUpdate()
		const id = interaction.customId.split(',').at(3)
		const channel = client.users.cache
			.get(interaction.user.id)
			?.dmChannel?.messages.cache.get(id!)
		await interaction.message.delete()
		await channel?.delete()
		await interaction.user.send({
			embeds: [embed.verificationApplicationSuccess],
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
			if (interaction.guild?.name === undefined) {
			} else {
				await interaction.user.send({
					embeds: [
						embed.verification(interaction.user, interaction.guild),
					],
					components: [button.verification],
				})
			}
		}
	}
	client.on('error', (async) => {})
})

client.on('interactionCreate', async (interaction) => {
	if (interaction.type !== Discord.InteractionType.ModalSubmit) return
	if (interaction.customId.startsWith('verification1')) {
		const buttons = button.verification()
		if (interaction.customId.split(',').at(2) === '2') {
			buttons.components[0]
				.setDisabled(true)
				.setStyle(Discord.ButtonStyle.Secondary)
			buttons.components[1]
				.setDisabled(true)
				.setStyle(Discord.ButtonStyle.Primary)
			buttons.components[2]
				.setDisabled(true)
				.setStyle(Discord.ButtonStyle.Secondary)
			buttons.components[3]
				.setDisabled(true)
				.setStyle(Discord.ButtonStyle.Secondary)
			if (interaction.isFromMessage()) {
				interaction.update({
					components: [buttons],
				})
			}
		}
		if (interaction.customId.split(',').at(2) === '3') {
			buttons.components[0]
				.setDisabled(true)
				.setStyle(Discord.ButtonStyle.Secondary)
			buttons.components[1]
				.setDisabled(true)
				.setStyle(Discord.ButtonStyle.Secondary)
			buttons.components[2]
				.setDisabled(true)
				.setStyle(Discord.ButtonStyle.Primary)
			buttons.components[3]
				.setDisabled(true)
				.setStyle(Discord.ButtonStyle.Secondary)
			if (interaction.isFromMessage()) {
				interaction.update({
					components: [buttons],
				})
			}
		}
		if (interaction.customId.split(',').at(2) === '4') {
			buttons.components[0]
				.setDisabled(true)
				.setStyle(Discord.ButtonStyle.Secondary)
			buttons.components[1]
				.setDisabled(true)
				.setStyle(Discord.ButtonStyle.Secondary)
			buttons.components[2]
				.setDisabled(true)
				.setStyle(Discord.ButtonStyle.Secondary)
			buttons.components[3]
				.setDisabled(true)
				.setStyle(Discord.ButtonStyle.Primary)
			if (interaction.isFromMessage()) {
				interaction.update({
					components: [buttons],
				})
			}
		}
		const id = interaction.customId.split(',')
		id.shift()
		interaction.user
			.send({
				embeds: [embed.verification2(interaction)],
				components: [button.verification2(id)],
			})
			.catch(console.error)
	}
})

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return
	const { commandName } = interaction
	if (commandName === 'help') {
		await interaction.reply({
			embeds: [embed.verificationHelp(client)],
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
