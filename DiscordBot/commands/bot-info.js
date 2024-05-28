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
            .setDescription("JokerBot is a cohesive economy bot that holds a main focus on betting on various activities. Although there is certainly more to come.\nJokerBot was created in May of 2024.\nBelow you can find the slash commands with brief descriptions:")
            .setColor(embedColor)
            .addFields({
                name: 'Games',
                value: 'coinflip: Bet on head/tails.\nrock-paper-scissors: Bet on a game of rps against a computer.\nblackjack: Classic game of blackjack.\nroulette (colors and numbers): Can pick to bet on colors or numbers. Numbers has 5x initial bet payout if you win.\nhorse-race: Three horses are generated with 3 different probailities of winning. Select one to win. Probabilities change on every new occurance',
                inline: true,
            },
            {
                name:'Functionality',
                value: 'balance: Check your current balance\ndaily: Redeem daily reward\nuser-info: Check information of any user in the server (if registered).\nleaderboard: Check local leaderboard.\ntransfer: Transfer money to someone else.\nwork: Work for some money. Available once an hour.\nshop: Buy some cool aadd-ons. Shop in development.\nshop-info: Checks what is in the shop',
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