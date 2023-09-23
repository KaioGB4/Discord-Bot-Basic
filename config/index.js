const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const fs = require('node:fs');
const path = require('node:path');
const {TOKEN, CLIENT_ID, GUILD_ID} = process.env

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[Aviso] O comando no ${filePath} está sem a "Data" ou "Execute".`);
		}
	}
}

client.once(Events.ClientReady, c => {
	console.log(`Pronto! Logado como ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`Nenhum comando com o nome ${interaction.commandName} foi encontrado.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'Aqui ocorreu um erro pra executar o comando!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'Aqui ocorreu um erro pra executar o comando!', ephemeral: true });
		}
	}
});

client.login(TOKEN);