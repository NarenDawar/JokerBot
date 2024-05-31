const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const profileModel = require("../models/profileSchema");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Information about the bot."),
    async execute(interaction, profileData) {
        const {embedColor} = profileData;
        let informationBoard = new EmbedBuilder()
            .setTitle("Information About JokerBot")
            .setDescription("JokerBot is a cohesive economy bot that holds a main focus on betting on various activities. Although there is certainly more to come.\nJokerBot was created in May of 2024.\nBelow you can find the slash commands with brief descriptions:")
            .setColor(embedColor)
            .addFields({
                name: 'Games',
                value: '**coinflip**: Bet on head/tails.\n**rock-paper-scissors**: Bet on a game of rps against a computer.\n**blackjack**: Classic game of blackjack.\n**roulette (colors and numbers)**: Can pick to bet on colors or numbers. Numbers has 5x initial bet payout if you win.\n**horse-race**: Three horses are generated with 3 different probabilities of winning. Select one to win. Probabilities change on every new occurrence.',
                inline: true,
            },
            {
                name:'Functionality',
                value: '**balance**: Check your current balance.\n**daily**: Redeem daily reward.\n**user-info**: Check information of any user in the server (if registered).\n**leaderboard**: Check local leaderboard (coin-based ranking).\n**transfer**: Transfer money to someone else.\n**work**: Work for some money. Available once an hour.\n**shop**: Buy some cool add-ons. Shop in development.\n**shop-info**: Checks what is in the shop.',
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
                name: "Ensuring Functionality (IMPORTANT)",
                value: "There are two things you need to ensure so that this bot works.:\n1. Go to Sever Settings -> Integrations -> JokerBot -> Ensure the @everyone is green.\n2. Ensure that all roles in your server have the following permission turned on: Use Application Commands"
            },
            {  
                name:'Server',
                value: 'Join the community server below:\nhttps://discord.gg/uVvA8D6MJb',
            })


            return await interaction.reply({ embeds: [informationBoard]});
    },
}