const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { minBet, maxBet } = require("../globalValues.json");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("blackjack")
        .setDescription("Bet on a classic game of blackjack.")
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
        const { coins } = profileData;
        const {embedColor} = profileData;
        const blackjackEmbed = new EmbedBuilder().setColor(embedColor);
        blackjackEmbed.setTitle('Blackjack 🃏')

        if (coins < betAmt) {
            blackjackEmbed.setDescription(`You do not have **${betAmt}** coins.`);
            return await interaction.editReply({ embeds : [blackjackEmbed]});
        }
      
        if (!(betAmt >= minBet) || !(betAmt <= maxBet)) {
            blackjackEmbed.setDescription(`Invalid amount. Minimum bet amount is **${minBet}** and maximum bet amount is **${maxBet}**`);
            return await interaction.editReply({ embeds : [blackjackEmbed] });
        }

        const compStartHand = Math.floor(Math.random() * 11) + 16;
        let userStartHand = Math.floor(Math.random() * 21) + 1;

        const hitButton = new ButtonBuilder()
			.setCustomId('Hit')
			.setLabel('Hit')
			.setStyle(ButtonStyle.Success);

		const foldButton = new ButtonBuilder()
			.setCustomId('Stay')
			.setLabel('Stay')
			.setStyle(ButtonStyle.Danger);

		const row = new ActionRowBuilder()
			.addComponents(hitButton, foldButton);

        blackjackEmbed
            .setTitle("Blackjack Table 🃏")
            .setFooter({text: `You have bet ${ betAmt } coins.`})
            .setDescription(`Would you like to hit or stay?\nYour current hand adds up to: **${ userStartHand }**`);

        await interaction.editReply({
            components: [row],
            embeds: [blackjackEmbed]
        });

        const message = await interaction.fetchReply();

        const filter = (i) => i.user.id === interaction.user.id && (i.customId === 'Hit' || i.customId === 'Stay');
        const collector = message.createMessageComponentCollector({ filter, time: 30000});


        collector.on('collect', async (i) => {

            if(i.customId === 'Hit') {
                // If user chooses to Hit, draw a new card and calculate new hand value
                const newCard = Math.floor(Math.random() * 10) + 1; // Draw a card between 1 and 10
                userStartHand += newCard;

                // Check if user busts (hand value exceeds 21)
                if (userStartHand > 21) {
                    // If user busts, update user's balance and stop collector
                    await profileModel.findOneAndUpdate (
                        { userId: id },
                        { $inc: { coins: -betAmt, }, }
                    );
                    blackjackEmbed.setDescription(`You **busted**! Your hand value is now **${userStartHand}**.`)
                    blackjackEmbed.setFooter({text: `You have lost ${betAmt} coins.`});
                    await i.update({ embeds : [blackjackEmbed] , components: [] });
                    collector.stop();
                    return;
                }

                // Update user on their current hand value and ask if they want to Hit or Stay again
                blackjackEmbed.setDescription(`Your new card is **${newCard}**.\n Your hand value is now **${userStartHand}**. \nWould you like to **Hit** or **Stay**?`);
                await i.update({
                    embeds : [blackjackEmbed],
                    components: [row]
                });

            }else if(i.customId === 'Stay') {
                const compHandValue = compStartHand;

                // Determine winner based on hand values
                if (userStartHand > compHandValue || compHandValue > 21) {
                    blackjackEmbed.setDescription(`**Congratulations! You won!** Your hand value: **${userStartHand}**, Computer's hand value: **${compHandValue}**`);
                    blackjackEmbed.setFooter({text: `You have won ${betAmt} coins.`})
                    await profileModel.findOneAndUpdate (
                        { userId: id },
                        { $inc: { coins: betAmt, numOfWins: 1 }, }
                    );
                } else if (userStartHand < compHandValue) {
                    blackjackEmbed.setDescription(`**Sorry, you lost**. Your hand value: **${userStartHand}**, Computer's hand value: **${compHandValue}**`);
                    blackjackEmbed.setFooter({text: `You have lost ${betAmt} coins.`})
                    await profileModel.findOneAndUpdate (
                        { userId: id },
                        { $inc: { coins: -betAmt }, }
                    );
                } else {
                    blackjackEmbed.setDescription(`**It's a tie!** Your hand value: **${userStartHand}**, Computer's hand value: **${compHandValue}**`);
                    blackjackEmbed.setFooter({text: `You have not won/lost coins.`})
                }
                await interaction.editReply({ embeds: [blackjackEmbed], components: [] });
                collector.stop();
                return;
            }
        })

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                blackjackEmbed.setDescription(`You timed out!`);
                blackjackEmbed.setFooter({text: `You have bet ${betAmt} coins.`});
                interaction.channel.send({ embeds: [blackjackEmbed], components: [], files: [] });
            }
        });
    },
};
