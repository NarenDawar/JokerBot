const { Minesweeper  } = require('discord-gamecord');
const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const { minBet, maxBet } = require("../globalValues.json");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('minesweeper')
    .setDescription('Bet on a minesweeper game!')
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

        const mineDash = new EmbedBuilder()
            .setTitle("MineSweeper 💣")
            .setTimestamp()
            .setColor(embedColor);

        if(!(betAmt >= minBet) || !(betAmt <= maxBet)) {
            mineDash.setDescription(`Invalid amount. Minimum bet amount is **${ minBet }** and maximum bet amount is **${ maxBet }**`);
            return await interaction.editReply({ embeds : [mineDash]});
        }

        if (coins < betAmt) {
            mineDash.setDescription(`You do not have **${betAmt}** coins.`);
            return await interaction.editReply({ embeds : [mineDash]});
        }

        const Game = new Minesweeper({
            message: interaction,
            isSlashGame: true,
            embed: {
              title: 'Minesweeper',
              color: embedColor.toString(),
              description: 'Click on the buttons to reveal the blocks except mines.'
            },
            emojis: { flag: '🚩', mine: '💣' },
            mines: 5,
            timeoutTime: 60000,
            winMessage: `You won the Game! You successfully avoided all the mines. You won ${betAmt} coins`,
            loseMessage: `You lost the Game! Beaware of the mines next time. You lost ${betAmt} coins`,
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