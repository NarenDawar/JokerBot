const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema"); // Make sure to import your profile model

module.exports = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Returns your balance or the balance of another user.")
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user whose balance you want to check')
                .setRequired(false)), 
    async execute(interaction, profileData) {
        const {embedColor} = profileData;

        let balanceDash = new EmbedBuilder()
            .setTitle('Current Balance 💰')
            .setColor(embedColor)
            .setTimestamp();
        // Get the user mentioned or default to the user who executed the command
        const user = interaction.options.getUser('user') || interaction.user;
        const userId = user.id;

        // Fetch the profile data from the database
        const profileData2 = await profileModel.findOne({ userId: userId });

        if (!profileData2) {
            balanceDash.setDescription(`No profile data found for ${user.username}.`)
            return await interaction.reply({embeds: [balanceDash]});
        }

        const { coins } = profileData2;

        // Create the embed message
        balanceDash.setDescription(`**${user.username}** has **${coins}** coins!`)
        // Reply with the embed message
        await interaction.reply({ embeds: [balanceDash] });
    },
};
