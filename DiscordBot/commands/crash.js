const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { minBet, maxBet } = require("../globalValues.json");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("crash")
        .setDescription("Classic game of crash!")
        .addIntegerOption(option =>
            option.setName("amount")
                .setDescription("Amount of coins you want to bet.")
                .setRequired(true)
                .setMinValue(1)),
    async execute(interaction, profileData) {
        await interaction.deferReply();

        const amount = interaction.options.getInteger('amount');
        const coins = parseInt(profileData.coins); // Convert coins to an integer
        const { embedColor } = profileData;
        const userId = interaction.user.id;

        let machineDash = new EmbedBuilder()
            .setTitle('Crash ✖️')
            .setColor(embedColor)
            .setTimestamp();

        if (coins < amount) {
            machineDash.setDescription(`You do not have **${amount}** coins.`);
            return await interaction.editReply({ embeds: [machineDash] });
        }

        if (!(amount >= minBet) || !(amount <= maxBet)) {
            machineDash.setDescription(`Invalid amount. Minimum bet amount is **${minBet}** and maximum bet amount is **${maxBet}**`);
            return await interaction.editReply({ embeds: [machineDash] });
        }

        // Generate a random number to determine the outcome
        const outcomeRandom = Math.random();

        let multiplier;
        let outcome;
        // Determine the outcome based on the random number
        if (outcomeRandom <= 0.4) { // 40% chance of winning
            multiplier = Math.random() * 0.4 + 1.1; // Multiplier between 1.1 and 1.5
            outcome = 'win';
        } else { // 60% chance of losing
            multiplier = Math.random() * 0.4 + 1.5; // Multiplier between 1.5 and 1.9
            outcome = 'lose';
        }

        // Generate a random crash point between 1.1 and 4
        const crashPoint = Math.random() * 2.9 + 1.1;

        // Calculate new balance based on the outcome
        let newCoins;
        if (outcome === 'win') {
            newCoins = coins + Math.floor(amount * multiplier);
        } else {
            newCoins = coins - amount;
        }

        // Update user's balance in the database
        await profileModel.findOneAndUpdate(
            { userId },
            { coins: newCoins },
            { new: true }
        );

        // Prepare response message
        const embed = new EmbedBuilder()
            .setTitle('Crash Results')
            .addFields(
                { name: 'Multiplier', value: `${multiplier.toFixed(2)}x`, inline: true },
                { name: 'Crash Point', value: `${crashPoint.toFixed(2)}x`, inline: true },
                { name: 'Outcome', value: outcome === 'win' ? 'You **win!**' : 'You **lose!**', inline: true },
                { name: 'New Balance', value: `${newCoins} coins`, inline: true }
            )
            .setColor(outcome === 'win' ? 0x00FF00 : 0xFF0000)
            .setTimestamp();

        // Send response message
        await interaction.editReply({ embeds: [embed] });
    },
};
