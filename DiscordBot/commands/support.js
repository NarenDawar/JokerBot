const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("support")
        .setDescription("Contains the link to the support server!"),
    async execute(interaction, profileData) {
        const {embedColor} = profileData;

        let supportDash = new EmbedBuilder()
            .setTitle('Support Information 👨‍💻')
            .setColor(embedColor)
            .setDescription(`Link to the community/support server (just click it): https://discord.gg/MUWhBYyJQD`)
            .setTimestamp();
        await interaction.reply({ embeds : [supportDash]});
    },
}