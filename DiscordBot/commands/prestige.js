const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("prestige")
        .setDescription("Rank up! Benefits coming soon."),
    async execute(interaction, profileData) {
        await interaction.deferReply();
        const { embedColor, coins, prestige } = profileData;

        const rankMap = new Map([
            ['Beginner I', 0],
            ['Beginner II', 5000],
            ['Beginner III', 10000],
            ['Adequate I', 35000],
            ['Adequate II', 65000],
            ['Adequate III', 100000],
            ['Addict I', 300000],
            ['Addict II', 500000],
            ['Addict III', 750000],
            ['Gambler I', 900000],
            ['Gambler II', 1500000],
            ['Gambler III', 3000000],
            ['Professional I', 7000000],
            ['Professional II', 30000000],
            ['Professional III', 70000000],
            ['Joker I', 100000000],
            ['Joker II', 300000000],
            ['Joker III', 500000000],
            ['King I', 600000000],
            ['King II', 800000000],
            ['King III', 1000000000],
        ]);

        const prestigeDash = new EmbedBuilder()
            .setTitle('Prestige 👑')
            .setColor(embedColor);

        // Find the current prestige level and calculate the cost for the next level
        const currentLevelIndex = [...rankMap.keys()].indexOf(prestige);
        if (currentLevelIndex === -1 || currentLevelIndex === [...rankMap.keys()].length - 1) {
            prestigeDash.setDescription(`You have reached the max prestige level or are at an invalid level.`);
            return await interaction.editReply({
                embeds: [prestigeDash]
            });
        }

        const nextLevel = [...rankMap.keys()][currentLevelIndex + 1];
        const cost = rankMap.get(nextLevel);

        prestigeDash.setDescription(`Are you sure you want to prestige to **${nextLevel}**? It will cost **${cost}** coins.`)
        
        if (coins < cost) {
            prestigeDash.setDescription(`You don't have enough coins to prestige. You need **${cost}** coins.`);
            return await interaction.editReply({
                embeds : [prestigeDash]
            });
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
            embeds: [prestigeDash]
        });

        const message = await interaction.fetchReply();
        const filter = (i) => i.user.id === interaction.user.id && (i.customId === 'Yes' || i.customId === 'No');
        const collector = message.createMessageComponentCollector({ filter, time: 30000 });

        collector.on('collect', async (i) => {
            if (i.customId === 'Yes') {
                await profileModel.findOneAndUpdate(
                    { userId: interaction.user.id },
                    {
                        $set: {
                            prestige: nextLevel,
                        },
                        $inc: {
                            coins: -cost
                        }
                    }
                );
                prestigeDash.setDescription(`You've successfully prestiged to **${nextLevel}**. Your balance is now **${coins}** coins.`);
            } else {
                prestigeDash.setDescription('Prestige cancelled. No changes have been made to your account.');
            }
            collector.stop();
            await interaction.editReply({ embeds: [prestigeDash], components: [] });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                prestigeDash.setDescription('You took too long to respond. Prestige action has been cancelled.');
                interaction.editReply({ embeds: [prestigeDash], components: [] });
            }
        });
    }
}
