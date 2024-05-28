const {SlashCommandBuilder} = require("discord.js");
const { EmbedBuilder } = require("@discordjs/builders");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("coins-leaderboard")
        .setDescription("Shows the top 10 earners!"),
    async execute(interaction, profileData) {
        await interaction.deferReply();

        const { username, id } = interaction.user;
        const { coins } = profileData;
        const { embedColor } = profileData;

        let leaderboardEmbed = new EmbedBuilder()
            .setTitle("Top 10 Coin Earners")
            .setColor(embedColor)
            .setFooter({ text: "You are not ranked yet."});

        const members = await profileModel
            .find()
            .sort({coins: -1})
            .catch((err) => console.log(err));

        const memberIds = members.findIndex((member) => member.userId === id);

        leaderboardEmbed.setFooter({
            text: `**${username}, your rank is #**${memberIds + 1} with **${coins}`,
        });

        const topTen = members.slice(0,10);
        let desc = "";
        for(let  i=0; i < topTen.length; i++) {
            let { user } = await interaction.guild.members.fetch(topTen[i].userId);
            if(!user) return;
            let userBalance = topTen[i].coins;
            desc += `${i + 1}, ${user.username}: ${userBalance} coins\n`;
        }

        if (desc != "") {
            leaderboardEmbed.setDescription(desc);
        }

        await interaction.editReply({ embeds: [leaderboardEmbed] });
    },
};