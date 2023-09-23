const { REST, Routes } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const { TOKEN, CLIENT_ID, GUILD_ID } = process.env;
const fs = require('node:fs');
const path = require('node:path');

const commands = [];
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[Aviso] O comando no ${filePath} está sem a "Data" ou "Execute".`);
		}
	}
}

const rest = new REST().setToken(TOKEN);

(async () => {
	try {
		console.log(`Iniciando recarregamento dos ${commands.length} commandos da aplicação.`);

		const data = await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: commands },
		);

		console.log(`Recarregado com sucesso ${data.length} commandos da aplicação.`);
	} catch (error) {
		console.error(error);
	}
})();