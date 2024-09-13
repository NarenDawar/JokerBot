const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('higher-lower')
        .setDescription('Play a game of Higher or Lower.')
        .addIntegerOption((option) => 
            option
                .setName("amount")
                .setDescription("Amount of coins you want to send.")
                .setRequired(true)
                .setMinValue(1)
            ),
    async execute(interaction, profileData) {
        const {embedColor} = profileData;
        const betAmt = interaction.options.getInteger('amount');
        const {id} = interaction.user.id;
        // Initial game setup
        let currentNumber = Math.floor(Math.random() * 100) + 1; // Number between 1 and 100
        let nextNumber = Math.floor(Math.random() * 100) + 1;
        let gameEnded = false;

        // Create embed
        const hOLembed = new EmbedBuilder()
            .setTitle('Higher or Lower Game 🎲')
            .setDescription(`Current number is **${currentNumber}**. Will the next number be higher or lower? (Numbers are between 1-100)`)
            .setColor(embedColor)
            .setTimestamp();

        // Create buttons
        const higherButton = new ButtonBuilder()
            .setCustomId('higher')
            .setLabel('Higher')
            .setStyle(ButtonStyle.Success);

        const lowerButton = new ButtonBuilder()
            .setCustomId('lower')
            .setLabel('Lower')
            .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
            .addComponents(higherButton, lowerButton);

        // Send initial message
        await interaction.reply({ embeds: [hOLembed], components: [row] });

        // Set up message component collector
        const filter = (i) => i.user.id === interaction.user.id && (i.customId === 'higher' || i.customId === 'lower');
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async (i) => {
            if (gameEnded) return;

            if (i.customId === 'higher') {
                if (nextNumber > currentNumber) {
                    profileModel.findOneAndUpdate (
                        {id},
                        {$inc: {coins: betAmt}},
                        {$inc: {numOfWins: 1}}
                    )
                    hOLembed.setDescription(`Congratulations! The next number was **${nextNumber}**, which is higher. You win!`);
                } else {
                    profileModel.findOneAndUpdate (
                        {id},
                        {$inc: {coins: -betAmt}}
                    )
                    hOLembed.setDescription(`Sorry, the next number was **${nextNumber}**, which is not higher. You lose.`);
                }
            } else if (i.customId === 'lower') {
                if (nextNumber < currentNumber) {
                    profileModel.findOneAndUpdate (
                        {id},
                        {$inc: {coins: betAmt}},
                        {$inc: {numOfWins: 1}}
                    )
                    hOLembed.setDescription(`Congratulations! The next number was **${nextNumber}**, which is lower. You win!`);
                } else {
                    profileModel.findOneAndUpdate (
                        {id},
                        {$inc: {coins: -betAmt}}
                    )
                    hOLembed.setDescription(`Sorry, the next number was **${nextNumber}**, which is not lower. You lose.`);
                }
            }

            gameEnded = true;
            await i.update({ embeds: [hOLembed], components: [] }); // Update message with result
        });

        collector.on('end', (collected) => {
            if (!gameEnded) {
                hOLembed.setDescription('Game ended due to inactivity.');
                interaction.editReply({ embeds: [hOLembed], components: [] });
            }
        });
    },
};
