import chalk from 'chalk'
import {
	timestamp,
	config,
	client2 as client,
	client3 as data,
} from '../initial.js'
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
	if (member.guild.id === '943404593105231882')
		return /* REMOVE THIS BEFORE STAGING */
	if (member.user.bot === false) {
		const buttons: any = button.verification(member.guild.id)
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
		const guildId: any = interaction.customId.split(',').at(1)
		await interaction.client.guilds.cache
			.get(guildId)
			?.members.kick(
				`${interaction.user.id}`,
				`User is under 13 | ${
					interaction.client.guilds.cache.get(guildId)?.name
				}`
			)
		const channel: any = client.channels.cache.get(
			config.testing.verificationChannel
		)
		if (channel?.isTextBased()) {
			await channel.send({
				embeds: [embed.verificationReview(interaction, guildId)],
			})
		}
	}

	if (interaction.customId.startsWith('verification1 2')) {
		const Id: any = interaction.customId.split(',')
		Id.shift()
		Id.push(`2,${interaction.message.id}`)
		await interaction.showModal(modal.verification(Id))
	}

	if (interaction.customId.startsWith('verification1 3')) {
		const Id: any = interaction.customId.split(',')
		Id.shift()
		Id.push(`3,${interaction.message.id}`)
		await interaction.showModal(modal.verification(Id))
	}

	if (interaction.customId.startsWith('verification1 4')) {
		const Id: any = interaction.customId.split(',')
		Id.shift()
		Id.push(`4,${interaction.message.id}`)
		await interaction.showModal(modal.verification(Id))
	}

	if (interaction.customId.startsWith('verification2 1')) {
		await interaction.deferUpdate()
		const id: any = interaction.customId.split(',').at(3)
		const message: any = client.users.cache
			.get(interaction.user.id)
			?.dmChannel?.messages.cache.get(id!)
		await interaction.message.delete()
		await message?.delete()
		let age = undefined
		if (interaction.customId.split(',').at(2) === '2') {
			age = '13-15'
		}
		if (interaction.customId.split(',').at(2) === '3') {
			age = '16-17'
		}
		if (interaction.customId.split(',').at(2) === '4') {
			age = '18+'
		}
		await interaction.user.send({
			embeds: [embed.verificationApplicationSuccess(age, 2, 3, 4, 5, 6)],
		})
		// SENDING EMBED TO VERIFICATION CHANNEL
		const channel: any = client.channels.cache.get(
			config.testing.verificationChannel
		)
		if (channel?.isTextBased()) {
			let invite = undefined
			let userCheck1 = undefined
			let userCheck2 = undefined
			let userCheck3 = undefined
			let response1 = undefined
			let response2 = undefined
			let response3 = undefined
			let response4 = undefined
			let response5 = undefined

			/* Invite */

			const guildId: any = interaction.customId.split(',').at(1)
			await channel.send({
				embeds: [
					embed.verificationReview(interaction, guildId, null, age),
				],
			})
		}
	}

	if (interaction.customId.startsWith('verification2 2')) {
		if (interaction.user.bot === false) {
			await interaction.deferUpdate()
			const id: any = interaction.customId.split(',').at(1)
			const buttons: any = button.verification(id)
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
			const id2: any = interaction.customId.split(',').at(3)
			const message: any = client.users.cache
				.get(interaction.user.id)
				?.dmChannel?.messages.cache.get(id2!)
			await interaction.message.delete()
			await message?.delete()
			await interaction.user.send({
				embeds: [
					embed.verification(
						interaction.user,
						client.guilds.cache.get(id)
					),
				],
				components: [buttons],
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
		const buttons: any = button.verification()
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
		const id: any = interaction.customId.split(',')
		id.shift()
		const guildId = interaction.customId.split(',').at(1)
		const guildIcon = client.guilds.cache.get(guildId!)
		interaction.user
			.send({
				embeds: [
					embed.verification2(interaction, guildIcon?.iconURL()),
				],
				components: [button.verification2(id)],
			})
			.catch(console.error)
		// Sending Modal Submission to Database
		interface verification {
			_id: string | undefined
			name: string | undefined
			settings: {
				verificationType: number
				embeds: { verification: number[] }
			}
			verification: {
				[x: string]: {
					verifyType: number
					username: string | undefined
					invite: {
						url: string | undefined
						author: string | undefined
					}
					modalResponses: { [x: string]: any }
				}
			}
		}
		data.db('BaseInteraction')
			.collection<verification>('guild')
			.insertOne({
				_id: guildId,
				name: client.guilds.cache.get(guildId!)?.name,
				settings: {
					verificationType: 1,
					embeds: {
						verification: [1, 2, 3],
					},
				},
				verification: {
					[interaction.user.id]: {
						verifyType: 1,
						username: interaction.user.username,
						invite: {
							url: 'evdscfERv',
							author: 'Acestriker#0001',
						},
						modalResponses: [
							interaction.fields.getTextInputValue(
								'verification1 1'
							),
							interaction.fields.getTextInputValue(
								'verification1 2'
							),
							interaction.fields.getTextInputValue(
								'verification1 3'
							),
							interaction.fields.getTextInputValue(
								'verification1 4'
							),
							interaction.fields.getTextInputValue(
								'verification1 5'
							),
						],
					},
				},
			})
	}
})

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return
	const { commandName }: any = interaction
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
/*client.user?.setPresence({
		activities: [{ name: `${client.guild.memberCount} users`, type: Discord.ActivityType.Watching }],
		status: 'online',
	})*/
