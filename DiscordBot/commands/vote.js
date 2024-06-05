const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("vote")
        .setDescription("Vote for the bot to help it grow!"),
    async execute(interaction, profileData) {
        const {embedColor} = profileData;

        let voteDash = new EmbedBuilder()
            .setTitle('Vote ⬆️')
            .setColor(embedColor)
            .setDescription(`Click this link and vote for the bot! This helps it gain visibility: https://top.gg/bot/1238711931574161438?s=05feecda02d9e`)
            .setTimestamp();
        await interaction.reply({ embeds : [voteDash]});
    },
}