const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("updates")
        .setDescription("View recent updates."),
    async execute(interaction, profileData) {
        const {embedColor} = profileData;

        let voteDash = new EmbedBuilder()
            .setTitle('Updates 💬')
            .setColor(embedColor)
            .setDescription(`Alpha Update (9/13/24)\n\n- rob: Rob players (30% success rate, 1 day cooldown).\n- local-coins-leaderboard: Guild-limited coins leaderboard.\n- local-wins-leaderboard: Guild-limited wins leaderboard.\n` + 
                `- update-log: Shows developer updates.\n- balance: Can now check the balance of other users. No entry defaults to your balance.\n- reset: Resets all your data.\n` +
                `- prestige: New prestige system introduced. Shows up on user-info. More to come!\n- higher-lower: Simple game of higher/lower with a pool of 1-100.\n` +
                `- dice-roll: Roll a dice. Must land higher than 4 to win!\n- bank balance: Interest added every 24 hours.\n` + `\nUpdates will begin coming out regularly! Stay tuned!` 
            )
        await interaction.reply({ embeds : [voteDash]});
    },
}