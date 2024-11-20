const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("local-wins-leaderboard")
        .setDescription("Shows the top 10 earners within your guild!"),
    async execute(interaction, profileData) {
        await interaction.deferReply();

        const { username, id } = interaction.user;
        const { numOfWins } = profileData;
        const { embedColor } = profileData;
        const guild = interaction.guild;

        let leaderboardEmbed = new EmbedBuilder()
            .setTitle("Top 10 Local Winners 🏆")
            .setColor(embedColor)
            .setTimestamp();

        // Fetch all users who have interacted with the bot at some point
        const allMembers = await profileModel.find().sort({ numOfWins: -1 }).catch(err => console.log(err));

        //for local, retrieve all server users, check if they are in the database, then rank them.

        // Filter users who are part of the current server
        const guildMembers = allMembers.filter(member => guild.members.cache.has(member.userId));

        // Find the rank of the current user
        const memberRank = guildMembers.findIndex(member => member.userId === id);

        if (memberRank === -1) {
            leaderboardEmbed.setFooter({
                text: `${username}, you are not ranked yet with ${numOfWins} wins.`,
            });
        } else {
            leaderboardEmbed.setFooter({
                text: `${username}, your rank is #${memberRank + 1} with ${numOfWins} wins`,
            });
        }

        // Get the top 10 users from the current server
        const topTen = guildMembers.slice(0, 10);
        let description = "";
        for (let i = 0; i < topTen.length; i++) {
            let user = await interaction.client.users.fetch(topTen[i].userId);
            if (!user) continue; // Ensure user exists
            let userWins = topTen[i].numOfWins;
            description += `${i + 1}. ${user.username}: ${userWins} wins\n`;
        }

        if (description != "") {
            leaderboardEmbed.setDescription(description);
        } else {
            leaderboardEmbed.setDescription("No winners found in this guild.");
        }

        await interaction.editReply({ embeds: [leaderboardEmbed] });
    },
};
