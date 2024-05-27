const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const profileModel = require("../models/profileSchema");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop-info")
        .setDescription("Information about the shop."),
    async execute(interaction, profileData) {
        const {embedColor} = profileData;
        let informationBoard = new EmbedBuilder()
            .setTitle("Information About The Store")
            .setDescription("The shop is where you can purchase various items. This is still in development.")
            .setColor(embedColor)
            .addFields({
                name: 'Items:',
                value: '**embedColor**: Change your embed color for all functions.\n' +
                `**customTitle**: Change your profile associated title.\n` +
                `**customPhrase**: Change your profile associated phrase.\n\n` +
                `**All of these purchases show up on user-info.**`,
                inline: false,
            });

            return await interaction.reply({ embeds: [informationBoard]});
    },
}