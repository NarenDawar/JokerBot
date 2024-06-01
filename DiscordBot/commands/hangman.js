const { Hangman } = require('discord-gamecord');
const {SlashCommandBuilder, EmbedBuilder,ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const { minBet, maxBet } = require("../globalValues.json");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('hangman')
    .setDescription('Bet on a hangman game!')
    .addIntegerOption((option) => 
        option
            .setName("amount")
            .setDescription("Amount of coins you want to send.")
            .setRequired(true)
            .setMinValue(1)
        ),
    
    async execute(interaction, profileData) {
        await interaction.deferReply();
        const userId = interaction.user.id;
        const betAmt = interaction.options.getInteger('amount');
        const { coins, embedColor } = profileData;

        const hangDash = new EmbedBuilder()
            .setTitle("Trivia ❓")
            .setTimestamp()
            .setColor(embedColor);

        if(!(betAmt >= minBet) || !(betAmt <= maxBet)) {
            hangDash.setDescription(`Invalid amount. Minimum bet amount is **${ minBet }** and maximum bet amount is **${ maxBet }**`);
            return await interaction.editReply({ embeds : [hangDash]});
        }

        if (coins < betAmt) {
            hangDash.setDescription(`You do not have **${betAmt}** coins.`);
            return await interaction.editReply({ embeds : [hangDash]});
        }

            const Game = new Hangman({
                message: interaction,
                isSlashGame: false,
                embed: {
                  title: 'Hangman',
                  color: embedColor.toString(),
                  description: "You have one minute to guess the answer."
                },
                hangman: { hat: '🎩', head: '😟', shirt: '👕', pants: '🩳', boots: '👞👞' },
                timeoutTime: 60000,
                theme: 'nature',
                winMessage: `You won ${betAmt} coins! The word was **{word}**.`,
                loseMessage: `You lost ${betAmt} coins! The word was **{word}**.`,
                playerOnlyMessage: 'Only {player} can use these buttons.'
              });

            Game.startGame();
            Game.on('gameOver', async result => {
                if(result.result === 'win') {
                    await profileModel.findOneAndUpdate({userId}, { $inc: {coins: betAmt}});
                }
                else {
                    await profileModel.findOneAndUpdate({userId}, { $inc: {coins: -betAmt}});
                }
            });
        }
}