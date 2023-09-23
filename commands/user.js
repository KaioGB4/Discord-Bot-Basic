const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Traz informações sobre o usuário'),
	async execute(interaction) {
		await interaction.reply(`Esse comando foi chamado por ${interaction.user.username}, que entrou no canal ${interaction.member.joinedAt}.`);
	},
};