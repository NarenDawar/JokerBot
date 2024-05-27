const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Returns your balance (number of coins!)"),
    async execute(interaction, profileData) {

        const {coins} = profileData;
        const {embedColor} = profileData;
        const username = interaction.user.username;

        const now = new Date();
        const currentDateTime = now.toLocaleString();

        let balanceDash = new EmbedBuilder()
            .setTitle('Current Balance')
            .setColor(embedColor)
            .setDescription(`**${username}** has **${coins}** coins!`)
            .setFooter({text: `As of ${ currentDateTime }`});
        await interaction.reply({ embeds : [balanceDash]});
    },
}