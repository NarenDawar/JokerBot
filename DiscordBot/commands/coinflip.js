const { SlashCommandBuilder, EmbedBuilder,ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const { minBet, maxBet } = require("../globalValues.json");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("coinflip")
        .setDescription("Bet on a coinflip, chances are 50/50!")
        .addIntegerOption((option) => 
            option
                .setName("amount")
                .setDescription("Amount of coins you want to bet.")
                .setRequired(true)
                .setMinValue(1)
        ),
    async execute(interaction, profileData) {
        await interaction.deferReply();

        const betAmt = interaction.options.getInteger("amount");
        const { id } = interaction.user;
        const {coins } = profileData;
        const {embedColor} = profileData;

        const coinDash = new EmbedBuilder()
            .setTitle('Coinflip')
            .setColor(embedColor)
            .setDescription("Heads or Tails?")
            .setFooter({text: `You have bet ${betAmt} coins.`});

        const headsButton = new ButtonBuilder()
			.setCustomId('Heads')
			.setLabel('Heads')
			.setStyle(ButtonStyle.Primary);

		const tailsButton = new ButtonBuilder()
			.setCustomId('Tails')
			.setLabel('Tails')
			.setStyle(ButtonStyle.Primary);

            const row = new ActionRowBuilder()
			.addComponents(headsButton, tailsButton);

            await interaction.editReply({
                components: [row],
                embeds: [coinDash]
            });

        if (coins < betAmt) {
            coinDash.setDescription(`You do not have ${betAmt} coins.`);
            return await interaction.editReply({ embeds : [coinDash]});
        }
      
        if (!(betAmt >= minBet) || !(betAmt <= maxBet)) {
            coinDash.setDescription(`Invalid amount. Minimum bet amount is ${minBet} and maximum bet amount is ${maxBet}`);
            return await interaction.editReply({ embeds : [coinDash]});
        }
        const message = await interaction.fetchReply();

        const filter = (i) => i.user.id === interaction.user.id && (i.customId === 'Heads' || i.customId === 'Tails');
        const collector = message.createMessageComponentCollector({ filter, time: 30000});


        collector.on('collect', async (i) => {
            const randomNum = Math.round(Math.random());
            const result = randomNum ? "Heads" : "Tails";

            if(i.customId === 'Heads') {
                if (result === 'Tails') {
                    coinDash.setDescription(`You **missed**!`);
                    coinDash.setFooter({text: `You lost ${betAmt} coins.`});
                    await profileModel.findOneAndUpdate (
                        { userId: id },
                        { $inc: { coins: -betAmt, }, }
                    );
                    await i.update({ embeds : [coinDash] , components: [] });
                    collector.stop();
                    return;
                }

                else {
                    coinDash.setDescription(`You **hit**!`);
                    coinDash.setFooter({text: `You won ${betAmt} coins.`});
                    await profileModel.findOneAndUpdate (
                        { userId: id },
                        { $inc: { coins: betAmt, numOfWins: 1 }, }
                    );
                    await i.update({ embeds : [coinDash] , components: [] });
                    collector.stop();
                    return;
                }
            }

            else if (i.customId === "Tails") {
                if (result === 'Tails') {
                    coinDash.setDescription(`You **hit**!`);
                    coinDash.setFooter({text: `You won ${betAmt} coins.`});
                    await profileModel.findOneAndUpdate (
                        { userId: id },
                        { $inc: { coins: betAmt, numOfWins: 1 }, }
                    );
                    await i.update({ embeds : [coinDash] , components: [] });
                    collector.stop();
                    return;
                }

                else {
                    coinDash.setDescription(`You **missed**!`);
                    coinDash.setFooter({text: `You lost ${betAmt} coins.`});
                    await profileModel.findOneAndUpdate (
                        { userId: id },
                        { $inc: { coins: -betAmt, }, }
                    );
                    await i.update({ embeds : [coinDash] , components: [] });
                    collector.stop();
                    return;
                }
            }
        })

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                coinDash.setDescription(`You timed out!`);
                coinDash.setFooter({text: `You have bet ${betAmt} coins.`});
                interaction.channel.send({ embeds: [coinDash], components: [], files: [] });
            }
        });
    },
};
