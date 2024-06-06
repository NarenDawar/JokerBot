const {SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder} = require("discord.js");
const profileModel = require('../models/profileSchema');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("redeem-workers")
        .setDescription("Returns your balance (number of coins!)"),
    async execute(interaction, profileData) {
        await interaction.deferReply();
        let workerTotal = 0;
        const {coins, embedColor, numOfWorkers} = profileData;
        const userId = interaction.user.id;

        let workerDash = new EmbedBuilder()
            .setTitle('Redeem Workers Money 👨‍🏭')
            .setColor(embedColor)
            .setTimestamp();

        function generateCoins() {
            workerTotal += 5*numOfWorkers; 
        }
        setInterval(generateCoins, 60000);

        workerDash.setDescription(`Your ${numOfWorkers} workers have earned: **${workerTotal}** coins. Would you like to redeem them?`);
        const redeemButton = new ButtonBuilder()
			.setCustomId('Redeem')
			.setLabel('Redeem')
			.setStyle(ButtonStyle.Success);

        const laterButton = new ButtonBuilder()
			.setCustomId('Wait')
			.setLabel('Wait')
			.setStyle(ButtonStyle.Danger);

        const row = new ActionRowBuilder()
		.addComponents(redeemButton, laterButton);

        await interaction.editReply({
            components: [row],
            embeds: [workerDash]
        });

        const message = await interaction.fetchReply();

        const filter = (i) => i.user.id === interaction.user.id && (i.customId === 'Redeem' || i.customId === 'Wait');
        const collector = message.createMessageComponentCollector({ filter, time: 30000});

        collector.on('collect', async (i) => { 
            if(i.customId === 'Wait') {
                workerDash.setDescription(`Return back later to see how much more your workers have earned!`);
                return await interaction.editReply({ embeds: [workerDash], components: []});
            }

            else if(i.customId === 'Redeem') {
                await profileModel.findOneAndUpdate (
                    { userId },
                    { $inc: { coins: workerTotal } }
                )
                workerTotal = 0;

                workerDash.setDescription(`You have redeemed **${workerTotal}** coins! Thank your workers!`);
                return await interaction.editReply({ embeds: [workerDash], components: []});
            }
            collector.stop();
        })
    },
}