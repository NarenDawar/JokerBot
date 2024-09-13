const { Trivia } = require('discord-gamecord');
const {SlashCommandBuilder, EmbedBuilder,ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const { minBet, maxBet } = require("../globalValues.json");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('trivia')
    .setDescription('Bet on a trivia game!')
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

        const triviaDash = new EmbedBuilder()
            .setTitle("Trivia ❓")
            .setTimestamp()
            .setColor(embedColor);

        if(!(betAmt >= minBet) || !(betAmt <= maxBet)) {
            triviaDash.setDescription(`Invalid amount. Minimum bet amount is **${ minBet }** and maximum bet amount is **${ maxBet }**`);
            return await interaction.editReply({ embeds : [triviaDash]});
        }

        if (coins < betAmt) {
            triviaDash.setDescription(`You do not have **${betAmt}** coins.`);
            return await interaction.editReply({ embeds : [triviaDash]});
        }

            const Game = new Trivia ({
                message: interaction,
                isSlashGame: true,
                embed: {
                    title: 'Trivia ❓',
                    color: embedColor.toString(),
                    description: "You have 20 seconds to answer."
                },
                timeoutTime: 20000,
                buttonStyle: 'PRIMARY',
                trueButtonStyle: 'SUCCESS',
                falseButtonStyle: 'DANGER',
                mode: 'multiple',
                difficulty: 'medium',  // easy || medium || hard
                winMessage: `You won **${betAmt}** coins! The correct answer is **{answer}**.`,
                loseMessage: `You lost **${betAmt}** coins! The correct answer is **{answer}**.`,
                errMessage: 'Unable to fetch question data! Please try again.',
                playerOnlyMessage: 'Only {player} can use these buttons.'
            });

            Game.startGame();
            Game.on('gameOver', async result => {
                if(result.result === 'win') {
                    await profileModel.findOneAndUpdate({userId: id}, { $inc: {coins: betAmt, numOfWins: 1}});
                }
                else {
                    await profileModel.findOneAndUpdate({userId: id}, { $inc: {coins: -betAmt}});
                }
            });
        }
}