const { Client, Events, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

const {TOKEN, CLIENT_ID, GUILD_ID} = process.env
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
	console.log(`Pronto! Logado como ${c.user.tag}`);
});

client.login(TOKEN);