const { SlashCommandBuilder, EmbedBuilder,ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const { minBet, maxBet } = require("../globalValues.json");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reset")
        .setDescription("Reset your account (honestly idk why you'd do this)."),
    async execute(interaction, profileData) {
        interaction.deferReply()
        const { embedColor } = profileData;

        const resetDash = new EmbedBuilder()
        .setTitle('Reset 🔄')
        .setDescription("Are you sure you want to reset your account?")
        .setColor(embedColor)

        if(!profileData) {
            resetDash.setDescription("You don't have a registered account. Please do a few actions before resetting.")
            return await interaction.editReply({embeds : [resetDash]})
        }

        const yesButton = new ButtonBuilder()
        .setCustomId('Yes')
        .setLabel('Yes')
        .setStyle(ButtonStyle.Success);

        const noButton = new ButtonBuilder()
        .setCustomId('No')
        .setLabel('No')
        .setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
			.addComponents(yesButton, noButton);
        
        await interaction.editReply({
            components: [row],
            embeds: [resetDash]
        });

        const message = await interaction.fetchReply();

        const filter = (i) => i.user.id === interaction.user.id && (i.customId === 'Yes' || i.customId === 'No');
        const collector = message.createMessageComponentCollector({ filter, time: 30000});


        collector.on('collect', async (i) => {
            if(f.customId === 'Yes') {
                await profileModel.findOneAndUpdate (
                    { userId: id },
                    { $set: { coins: 0, numOfWins: 0, embedColor: "ed4245", customTitle: "N/A",
                        customPhrase: "N/A", numofWins: 0, jobTitle: "Construction Worker", bankBalance: 0,
                        workLastUsed: 0, robLastUsed: 0, dailyLastUsed: 0, prestige: "Beginner I", lastDailyUpdate: Date.now()}, }
                );
                rouletteDash.setDescription(`You've successfully reset your account.`)
            } else {
                rouletteDash.setDescription(`Your account was not reset.`)
            }
            collector.stop();
            return await interaction.editReply({ embeds : [rouletteDash] , components: [], files: [] });
        })
    }
}