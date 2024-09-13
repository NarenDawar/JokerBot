// Can add GUILDID to env document for local experimentation.
require("dotenv").config();
const fs = require("node:fs");
const cron = require('node-cron');
const path = require("node:path");
const mongoose = require("mongoose");
const {DISCORD_TOKEN: token, MONGODB_SRV: database }= process.env;
const {Client, GatewayIntentBits, Collection} = require("discord.js");
const { SlashCommandBuilder, EmbedBuilder,ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,	
		GatewayIntentBits.GuildMessages	
    ],
});
// Event Handling Below
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));


for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

const { AutoPoster } = require('topgg-autoposter')
const poster = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzg3MTE5MzE1NzQxNjE0MzgiLCJib3QiOnRydWUsImlhdCI6MTcxNzM3ODc3NX0.POWc9AEbM16IYNW4wF375VEVdDYgiKnc6ESs3bFYMe4', client) // your discord.js or eris client

// optional
poster.on('posted', (stats) => { // ran when succesfully posted
  console.log(`Posted stats to Top.gg | ${stats.serverCount} servers`)
})
// Command Handling Below
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".js"));


	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}

mongoose.connect(database, {
	 useNewUrlParser: true, 
	 useUnifiedTopology: true, 
	}).then(() => {
		console.log("Connected to database");
	}).catch((err) => {
		console.log(err);
	});

const profileModel = require("./models/profileSchema");

// BANK BALANCE CODE -----------------------------------------


let messageCount = new Map();

client.on('messageCreate', async message => {
	if(!message.guild) return;

	const channelId = message.channel.id;
	messageCount.set(channelId, (messageCount.get(channelId) || 0) + 1);

	if(messageCount.get(channelId) === 20) {
		const embeder = new EmbedBuilder()
			.setTitle("Surprise Drop")
			.setDescription('Claim your coins!')
			.setColor('Red')
			.addFields({ name: 'Amount' , value: `${Math.floor(Math.random() * 700 - 100 + 1)} coins`})
			.setTimestamp();

		const row = new ActionRowBuilder()
		.addComponents(
			new ButtonBuilder()
				.setCustomId('claim')
				.setLabel('Claim')
				.setEmoji('🎁')
				.setStyle(ButtonStyle.Primary)
		);

		message.channel.send( {embeds : [embeder], components: [row]}).catch(() => {message.author.send("This bot is missing certain permissions to claim surprise drops.");});
		messageCount = new Map();
	}
});

client.on('interactionCreate', async interaction => {
	if(interaction.customId === 'claim') {
		const userId = interaction.user.id;
		
			const claimCoins = Math.floor(Math.random() * (700 - 100 + 1));
			await profileModel.findOneAndUpdate({ userId}, {$inc : {coins: claimCoins}});

			const row = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('claim')
						.setLabel('Claimed')
						.setEmoji('⏱️')
						.setStyle(ButtonStyle.Primary)
						.setDisabled(true)
				);
			await interaction.update({ content: `Claim Successful! **${claimCoins}** coins have been added to your balance.`, components: [row]})
	}
})
// BANK BALANCE CODE -----------------------------------------
const updateDailyBalances = async () => {
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    const now = Date.now();
    
    const profiles = await profileModel.find();
    
    for (const profile of profiles) {
        const { userId, lastDailyUpdate, bankBalance } = profile;
        if (now - new Date(lastDailyUpdate).getTime() >= oneDay) {
            const newBalance = bankBalance * 1.1;
            await profileModel.findOneAndUpdate(
                { userId },
                { $set: { coins: newBalance, lastDailyUpdate: now } }
            );
        }
    }
};

// Schedule the daily balance update
cron.schedule('0 0 * * *', () => {
    console.log('Running daily balance update...');
    updateDailyBalances().catch(console.error);
});

// Ensure the update function runs on bot startup
(async () => {
    try {
        console.log('Updating daily balances on startup...');
        await updateDailyBalances();
        console.log('Update complete.');
    } catch (error) {
        console.error('Error updating daily balances:', error);
    }
})();


client.login(token);