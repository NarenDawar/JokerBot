const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const profileModel = require("../models/profileSchema");
const { embedColorPrice, customTitlePrice, customPhrasePrice, 
    minerPrice, professorPrice, engineerPrice, scientistPrice, 
    rEAPrice, managerPrice, CEOPrice, marsAgentPrice, 
    celebrityPrice, multiDSPrice, workerPrice} = require("../shopPrices.json");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop-info")
        .setDescription("Information about the shop."),
    async execute(interaction, profileData) {
        const {embedColor} = profileData;
        let informationBoard = new EmbedBuilder()
            .setTitle("Information About The Shop 🛒")
            .setDescription("The shop is where you can purchase various items. This is still in development.")
            .setColor(embedColor)
            .addFields({
                name: 'Items:',
                value: `**embedColor**: Change your embed color for all functions. (Price: ${embedColorPrice})\n` +
                `**customTitle**: Change your profile associated title. (Price: ${customTitlePrice})\n` +
                `**customPhrase**: Change your profile associated phrase. (Price: ${customPhrasePrice})\n` +
                `**jobTitle**: Upgrade your job and make more from /work. Here are the multipliers and prices:\n` +
                `Construction (default): **1x**\nMiner: **1.5x** (Price: ${minerPrice})\nProfessor: **2x** (Price: ${professorPrice})\nEngineer: **2.5x** (Price: ${engineerPrice})\n` +
                `Scientist: **3x** (Price: ${scientistPrice})\nReal Estate Agent: **5x** (Price: ${rEAPrice})\nManager: **7x** (Price: ${managerPrice})\nCEO: **9x** (Price: ${CEOPrice})\n` +
                `Mars Agent: **11x** (Price: ${marsAgentPrice})\nCelebrity: **15x** (Price: ${celebrityPrice})\nMulti-Dimensional Spy: **20x** (Price: ${multiDSPrice})\n` +
                `**workers**: Purchase workers that work for you and gain coins over time. (Price: ${workerPrice})\n**All of these purchases show up on user-info. Prices listed.**`,
                inline: false,
            });

            return await interaction.reply({ embeds: [informationBoard]});
    },
}