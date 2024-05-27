const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const profileModel = require("../models/profileSchema");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("bot-info")
        .setDescription("Information about the bot."),
    async execute(interaction, profileData) {
        const {embedColor} = profileData;
        let informationBoard = new EmbedBuilder()
            .setTitle("Information About JokerBot")
            .setDescription("JokerBot is a cohesive economy bot that holds a main focus on betting on various activities.\nJokerBot was created in May of 2024.\nBelow you can find the slash commands:")
            .setColor(embedColor)
            .addFields({
                name: 'Games',
                value: 'coinflip\nrock-paper-scissors\nblackjack\nroulette (colors and numbers)',
                inline: true,
            },
            {
                name:'Functionality',
                value: 'balance\ndaily\ninfo\nleaderboard\ntransfer\nwork\nshop\nshop-info',
                inline: true,
            },
            {
                name: 'Channel Restriction',
                value: 'To place the bot in one channel, do the following:\n' +
                `1. Navigate to the 'Integrations' tab in your server settings.\n` +
                `2. Click 'Manage' next to the bot you want to restrict.\n` +
                `3. Change slash commands permission.\n` +
                `4. Deny the 'Use Slash Commands' permission for all channels.\n` +
                `5. Use toggles to change which channels allow commands.\n`,
                inline: false,

            },
            {
                name:'Server',
                value: 'Join the community server below:\nhttps://discord.gg/uVvA8D6MJb',
            })


            return await interaction.reply({ embeds: [informationBoard]});
    },
}