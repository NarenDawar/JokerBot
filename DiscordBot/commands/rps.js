const {SlashCommandBuilder, EmbedBuilder,ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const { minBet, maxBet } = require("../globalValues.json");
const profileModel = require("../models/profileSchema");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("rock-paper-scissors")
        .setDescription("Bet on a rock-paper-scissors game, chances are 1/3!")
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
        const { embedColor } = profileData;
        const rpsDash = new EmbedBuilder()
            .setTitle('Rock, Paper, Scissors')
            .setColor(embedColor)
            .setFooter({text: `You have bet ${betAmt} coins.`});

        const rockButton = new ButtonBuilder()
			.setCustomId('Rock')
			.setLabel('Rock 🪨')
			.setStyle(ButtonStyle.Primary);

		const paperButton = new ButtonBuilder()
			.setCustomId('Paper')
			.setLabel('Paper 📰')
			.setStyle(ButtonStyle.Primary);

        const scissorsButton = new ButtonBuilder()
			.setCustomId('Scissors')
			.setLabel('Scissors ✂️')
			.setStyle(ButtonStyle.Primary);

         const row = new ActionRowBuilder()
			.addComponents(rockButton, paperButton, scissorsButton);


        if (coins < betAmt) {
            rpsDash.setDescription(`You do not have **${betAmt}** coins.`);
            return await interaction.editReply({ embeds : [rpsDash]});
        }
          
        if(!(betAmt >= minBet) || !(betAmt <= maxBet)) {
            rpsDash.setDescription(`Invalid amount. Minimum bet amount is **${ minBet }** and maximum bet amount is **${ maxBet }**`);
            return await interaction.editReply({ embeds : [rpsDash]});
        }

        await interaction.editReply({
            components: [row],
            embeds: [rpsDash],
        });

        const message = await interaction.fetchReply();

        const filter = (i) => i.user.id === interaction.user.id && (i.customId === 'Rock' || i.customId === 'Paper' || i.customId === 'Scissors');
        const collector = message.createMessageComponentCollector({ filter, time: 30000});

        collector.on('collect', async (i) => {
            const randomNum = Math.floor(Math.random() * 3) + 1;
            let result;
                if(randomNum == 1) {
                    result = "Rock";
                }
                else if(randomNum == 2) {
                    result = "Paper";
                }
                else {
                    result = "Scissors";
                }

                if(i.customId === "Rock") {
                    if(result === "Rock") {
                        rpsDash.setDescription("Computer picked rock. **Tie**.")
                        rpsDash.setFooter({text: `You have neither won/lost coins.`});
                        await i.update({ embeds : [rpsDash] , components: [] });
                        collector.stop();
                        return;
                    }
                    else if(result === "Paper") {
                        rpsDash.setDescription(`Computer picked paper. You **missed!**`);
                        rpsDash.setFooter({text: `You have lost ${ betAmt } coins.`});
                        await profileModel.findOneAndUpdate (
                            { userId: id },
                            { $inc: { coins: -betAmt } }
                        );
                        await i.update({ embeds : [rpsDash] , components: [] });
                        collector.stop();
                        return;
                    }
                    else if(result === "Scissors") {
                        rpsDash.setDescription(`Computer picked scissors. You **hit!**`);
                        rpsDash.setFooter({text: `You have won ${ betAmt } coins.`});
                        await profileModel.findOneAndUpdate (
                            { userId: id },
                            { $inc: { coins: betAmt, numOfWins: 1 } }
                        );
                        await i.update({ embeds : [rpsDash] , components: [] });
                        collector.stop();
                        return;
                    }
                }
                else if(i.customId === "Paper") {
                    if(result === "Rock") {
                        rpsDash.setDescription(`Computer picked rock. You **hit!**`);
                        rpsDash.setFooter({text: `You have won ${ betAmt } coins.`});
                        await profileModel.findOneAndUpdate (
                            { userId: id },
                            { $inc: { coins: betAmt, numOfWins: 1 } }
                        );
                        await i.update({ embeds : [rpsDash] , components: [] });
                        collector.stop();
                        return;
                    }
                    else if(result === "Paper") {
                        rpsDash.setDescription(`Computer picked paper. **Tie**.`);
                        rpsDash.setFooter({text: `You have neither won/lost coins.`});
                        await i.update({ embeds : [rpsDash] , components: [] });
                        collector.stop();
                        return;
                    }
                    else if(result === "Scissors") {
                        rpsDash.setDescription(`Computer picked scissors. You **missed**!`);
                        rpsDash.setFooter({text: `You have lost ${ betAmt } coins.`});
                        await profileModel.findOneAndUpdate (
                            { userId: id },
                            { $inc: { coins: -betAmt } }
                        );
                        await i.update({ embeds : [rpsDash] , components: [] });
                        collector.stop();
                        return;
                    }
                }
                else if(i.customId === "Scissors") {
                    if(result === "Rock") {
                        rpsDash.setFooter({text: `You have lost ${ betAmt } coins.`});
                        rpsDash.setDescription(`Computer picked rock. You **missed**!`);

                        await profileModel.findOneAndUpdate (
                            { userId: id },
                            { $inc: { coins: -betAmt } }
                        );
                        await i.update({ embeds : [rpsDash] , components: [] });
                        collector.stop();
                        return;
                    }
                    else if(result === "Paper") {
                        rpsDash.setDescription(`Computer picked paper. You **hit!**`);
                        rpsDash.setFooter({text: `You have won ${ betAmt } coins.`});

                        await profileModel.findOneAndUpdate (
                            { userId: id },
                            { $inc: { coins: betAmt, numOfWins: 1 } }
                        );
                        await i.update({ embeds : [rpsDash] , components: [] });
                        collector.stop();
                        return;
                    }
                    else if(result === "Scissors") {
                        rpsDash.setDescription(`Computer picked scissors. **Tie**.`);
                        rpsDash.setFooter({text: `You have neither won/lost coins.`});
                        await i.update({ embeds : [rpsDash] , components: [] });
                        collector.stop();
                        return;
                    }
                }
            });
            collector.on('end', (collected, reason) => {
                if (reason === 'time') {
                    rpsDash.setDescription(`You timed out!`);
                    rpsDash.setFooter({text: `You have bet ${betAmt} coins.`});
                    interaction.channel.send({ embeds: [rpsDash], components: [], files: [] });
                }
            });
    },
}