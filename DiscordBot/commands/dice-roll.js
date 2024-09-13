const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("diceroll")
        .setDescription("Bet on the outcome of a dice roll!")
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('Amount of coins to bet')
                .setRequired(true)
        ),
    async execute(interaction, profileData) {
        const bet = interaction.options.getInteger('amount'); // Correct option name
        const { coins, embedColor } = profileData;
        const userId = interaction.user.id;

        const resultEmbed = new EmbedBuilder()
            .setTitle('Dice Roll 🎲')
            .setColor(embedColor)
            .setTimestamp();

        // Check if user has enough coins
        if (coins < bet) {
            resultEmbed.setDescription("You don't have enough coins to make this bet.");
            return await interaction.reply({embeds : [resultEmbed]});
        }

        // Roll the dice
        const roll = Math.floor(Math.random() * 6) + 1;

        // Determine win/lose
        if (roll > 4) {
            resultEmbed.setDescription(`You win! You won ${bet} coins.`);
            await profileModel.findOneAndUpdate(
                { userId },
                { $inc: { coins: bet } } // Update coins (add win amount, subtract bet)
            );
        }
        else {
            resultEmbed.setDescription(`You lost! You lost ${bet} coins.`);
            await profileModel.findOneAndUpdate(
                { userId },
                { $inc: { coins: -bet } } // Update coins (add win amount, subtract bet)
            );
        }
        // Reply with the result
        await interaction.reply({ embeds: [resultEmbed] });
    },
};
