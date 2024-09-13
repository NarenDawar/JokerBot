const { MatchPairs } = require('discord-gamecord');
const {SlashCommandBuilder, EmbedBuilder,ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const { minBet, maxBet } = require("../globalValues.json");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
    .setName('match-pairs')
    .setDescription('Bet on a match pairs game!')
    .addIntegerOption((option) => 
        option
            .setName("amount")
            .setDescription("Amount of coins you want to bet.")
            .setRequired(true)
            .setMinValue(1)
        ),
    
    async execute(interaction, profileData) {
        await interaction.deferReply();
        const {id} = interaction.user;
        const betAmt = interaction.options.getInteger('amount');
        const { coins, embedColor } = profileData;

        const hangDash = new EmbedBuilder()
            .setTitle("Match Pairs 🍐")
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

            const Game = new MatchPairs({
                message: interaction,
                isSlashGame: true,
                embed: {
                  title: 'Match Pairs',
                  color: embedColor.toString(),
                  description: "Match the pairs! 10 second timer!"
                },
                emojis: ['🍉', '🍇', '🍊', '🥭', '🍎', '🍏', '🥝', '🥥', '🍓', '🫐', '🍍', '🥕', '🥔'],
                timeoutTime: 10000,
                winMessage: `You won ${betAmt} coins!.`,
                loseMessage: `You lost ${betAmt} coins!.`,
                playerOnlyMessage: 'Only {player} can use these buttons.'
              });

            Game.startGame();
            Game.on('gameOver', async result => {
                if(result.result === 'win') {
                    await profileModel.findOneAndUpdate({userId: id}, { $inc: {coins: betAmt}},{ $inc: {numOfWins: 1}} );
                }
                else {
                    await profileModel.findOneAndUpdate({userId: id}, { $inc: {coins: -betAmt}});
                }
            });
        }
}