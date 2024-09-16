const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("local-coins-leaderboard")
        .setDescription("Shows the top 10 earners within your guild!"),
    async execute(interaction, profileData) {
        await interaction.deferReply();

        const { username, id } = interaction.user;
        const { coins } = profileData;
        const { embedColor } = profileData;
        const guild = interaction.guild;

        let leaderboardEmbed = new EmbedBuilder()
            .setTitle("Top 10 Local Coin Earners 🤑")
            .setColor(embedColor)
            .setFooter({ text: "You are not ranked yet." })
            .setTimestamp();

        // Fetch all users who have interacted with the bot at some point
        const allMembers = await profileModel.find().sort({ coins: -1 }).catch(err => console.log(err));

        // Filter users who are part of the current server
        const guildMembers = allMembers.filter(member => guild.members.cache.has(member.userId));

        // Find the rank of the current user
        const memberRank = guildMembers.findIndex(member => member.userId === id);

        if (memberRank === -1) {
            leaderboardEmbed.setFooter({
                text: `${username}, you are not ranked yet with ${coins} coins.`,
            });
        } else {
            leaderboardEmbed.setFooter({
                text: `${username}, your rank is #${memberRank + 1} with ${coins} coins`,
            });
        }

        // Get the top 10 users from the current server
        const topTen = guildMembers.slice(0, 10);
        let description = "";
        for (let i = 0; i < topTen.length; i++) {
            let user = await interaction.client.users.fetch(topTen[i].userId);
            if (!user) return;
            let userBalance = topTen[i].coins;
            description += `${i + 1}. ${user.username}: ${userBalance} coins\n`;
        }

        if (description != "") {
            leaderboardEmbed.setDescription(description);
        }

        await interaction.editReply({ embeds: [leaderboardEmbed] });
    },
};
