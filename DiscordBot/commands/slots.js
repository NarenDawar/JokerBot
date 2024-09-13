const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema");
const { Slots } = require('discord-gamecord');
const { minBet, maxBet } = require("../globalValues.json");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("slots")
        .setDescription("Bet on a game of slots!")
        .addIntegerOption((option) => 
        option
            .setName("amount")
            .setDescription("Amount of coins you want to send.")
            .setRequired(true)
            .setMinValue(1)
        ),
        
    async execute(interaction, profileData) {
        await interaction.deferReply();
        const {id} = interaction.user;
        const betAmt = interaction.options.getInteger('amount');
        const { coins, embedColor } = profileData;

        const slotDash = new EmbedBuilder()
            .setTitle("Slots 🎰")
            .setTimestamp()
            .setColor(embedColor);

        if(!(betAmt >= minBet) || !(betAmt <= maxBet)) {
            slotDash.setDescription(`Invalid amount. Minimum bet amount is **${ minBet }** and maximum bet amount is **${ maxBet }**`);
            return await interaction.editReply({ embeds : [slotDash]});
        }

        if (coins < betAmt) {
            slotDash.setDescription(`You do not have **${betAmt}** coins.`);
            return await interaction.editReply({ embeds : [slotDash]});
        }

        const Game = new Slots({
            message: interaction,
            isSlashGame: true,
            embed: {
                title: 'Slot Machine 🎰',
                color: embedColor.toString(),
            },
            slots: ['🍊', '🍎', '🍒', '🍌']
        });

            Game.startGame();
            Game.on('gameOver', async result => {
                if(result === 'win') {
                    await profileModel.findOneAndUpdate({userId: id}, { $inc: {coins: 2*betAmt, numOfWins: 1}});
                    interaction.followUp(`You **hit**! You have won **${betAmt*2}** coins!`);
                }
                else {
                    await profileModel.findOneAndUpdate({userId: id}, { $inc: {coins: -betAmt}});
                    interaction.followUp(`You **missed**! You have lost **${betAmt}** coins!`);
                }
            })
    },
};
