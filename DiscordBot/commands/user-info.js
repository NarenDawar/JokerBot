const {SlashCommandBuilder, EmbedBuilder, MessageEmbed} = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("user-info")
        .setDescription("Displays information about specified user.")
        .addUserOption((option) => 
        option
            .setName("user")
            .setDescription("User you want to recieve the money.")
            .setRequired(true)
        ),
    async execute(interaction, profileData) {
        const recievingUser = interaction.options.getUser("user");

        const { embedColor } = profileData;

        const userDash = new EmbedBuilder()
            .setTitle('User Information')
            .setColor(embedColor)
            .setThumbnail(recievingUser.displayAvatarURL())
            .setTimestamp();

        const recievingUserData = await profileModel.findOne(
            {
                userId: recievingUser.id,
            }
        );

        if(!recievingUserData) {
            await interaction.deferReply({ ephemeral: true });
            userDash.setDescription(`**${recievingUser.username}** is not in the system.`);
            return await interaction.editReply({ embeds : [userDash]});
        }

        await interaction.deferReply();

        userDash.setDescription(
            `**Username**: ${recievingUser.username}\n\n` +
            `**Balance**: ${recievingUserData.coins} coins\n\n` +
            `**Wins**: ${recievingUserData.numOfWins}\n\n` +
            `**Title**: ${recievingUserData.customTitle}\n\n` +
            `**Phrase**: ${recievingUserData.customPhrase}\n\n` +
            `**Selected Embed Color**: ${recievingUserData.embedColor}\n`
        );

        interaction.editReply({ embeds : [userDash]});

    },
};