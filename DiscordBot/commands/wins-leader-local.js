const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("local-wins-leaderboard")
        .setDescription("Shows the top 10 winners (players with most wins) within your guild!"),
    async execute(interaction, profileData) {
        await interaction.deferReply();

        const { username, id } = interaction.user;
        const { numOfWins } = profileData;
        const { embedColor } = profileData;
        const serverId = interaction.guild.id;

        let leaderboardEmbed = new EmbedBuilder()
            .setTitle("Top 10 Local Winners 🏆")
            .setColor(embedColor)
            .setTimestamp()
            .setFooter({ text: "You are not ranked yet."});

        const members = await profileModel
            .find({serverId: serverId})
            .sort({numOfWins: -1})
            .catch((err) => console.log(err));

        const memberIds = members.findIndex((member) => member.userId === id);

        leaderboardEmbed.setFooter({
            text: `${username}, your rank is #${memberIds + 1} with ${numOfWins} wins`,
        });

        const topTen = members.slice(0,10);
        let desc = "";
        for(let  i=0; i < topTen.length; i++) {
            let user = await interaction.client.users.fetch(topTen[i].userId); //line of interest, can add .guild. after interaction and member -> members
            if(!user) return;
            let userWins = topTen[i].numOfWins;
            desc += `${i + 1}. ${user.username}: ${userWins} wins\n`;
        }

        if (desc != "") {
            leaderboardEmbed.setDescription(desc);
        }

        await interaction.editReply({ embeds: [leaderboardEmbed] });
    },
};