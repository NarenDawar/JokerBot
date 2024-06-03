const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("invite")
        .setDescription("Invite this bot to your own server!"),
    async execute(interaction, profileData) {
        const {embedColor} = profileData;

        let inviteDash = new EmbedBuilder()
            .setTitle('Invite Information 🔗')
            .setColor(embedColor)
            .setDescription(`Invite link (just click it): https://discord.com/oauth2/authorize?client_id=1238711931574161438`)
            .setTimestamp();
        await interaction.reply({ embeds : [inviteDash]});
    },
}