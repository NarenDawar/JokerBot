const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder,AttachmentBuilder  } = require("discord.js");
const profileModel = require("../models/profileSchema");
const { minBet, maxBet } = require("../globalValues.json");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("roulette")
        .setDescription("Bet on a game of roulette, colors or numbers!")
        .addIntegerOption((option) => 
            option
                .setName("amount")
                .setDescription("Amount of coins you want to bet.")
                .setRequired(true)
                .setMinValue(1)
        ),

    async execute(interaction, profileData) {
        const picture = new AttachmentBuilder('roulette_table.png');
        await interaction.deferReply();
        const betAmt = interaction.options.getInteger("amount");

        const { id } = interaction.user;
        const { coins, embedColor } = profileData;

        const rouletteDash = new EmbedBuilder()
            .setTitle('Roulette')
            .setColor(embedColor)
            .setDescription("Would you like to play colors or numbers?")
            .setFooter({text: `You have bet ${betAmt} coins.`})
            .setImage('attachment://roulette_table.png');

        const colorsButton = new ButtonBuilder()
			.setCustomId('Colors')
			.setLabel('Colors 🔴')
			.setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
		.addComponents(colorsButton);


        if (coins < betAmt) {
            rouletteDash.setDescription(`You do not have ${betAmt} coins.`);
            return await interaction.editReply({ embeds : [rouletteDash]});
        }
      
        if (!(betAmt >= minBet) || !(betAmt <= maxBet)) {
            rouletteDash.setDescription(`Invalid amount. Minimum bet amount is ${minBet} and maximum bet amount is ${maxBet}`);
            return await interaction.editReply({ embeds : [rouletteDash]});
        }

        await interaction.editReply({
            components: [row],
            embeds: [rouletteDash],
            files: [picture]
        });

        const message = await interaction.fetchReply();

        const filter = (i) => i.user.id === interaction.user.id && (i.customId === 'Colors' || i.customId === 'Numbers');
        const collector = message.createMessageComponentCollector({ filter, time: 30000});

////make multiple collectors or put result outside of collector ???
        collector.on('collect', async (i) => {
            if(i.customId === 'Colors') {
                const randomNum = Math.round(Math.random());
                const result = randomNum ? "Red" : "Black";

                const redButton = new ButtonBuilder()
			    .setCustomId('Red')
			    .setLabel('Red 🟥')
			    .setStyle(ButtonStyle.Danger);

		        const blackButton = new ButtonBuilder()
			    .setCustomId('Black')
			    .setLabel('Black ⬛')
			    .setStyle(ButtonStyle.Secondary);

                const row2 = new ActionRowBuilder()
		        .addComponents(redButton, blackButton);

                rouletteDash.setDescription('Would you like to bet on red or black?');
                await i.update({
                    embeds : [rouletteDash],
                    components: [row2]
                });

                const message2 = await i.fetchReply();
                const filter = (f) => f.user.id === interaction.user.id && (f.customId === 'Red' || f.customId === 'Black');
                const collector2 = message2.createMessageComponentCollector({ filter, time: 30000});

                collector2.on('collect', async (f) => {
                    if(f.customId === result) {
                        await profileModel.findOneAndUpdate (
                            { userId: id },
                            { $inc: { coins: betAmt, numOfWins: 1}, }
                        );
                        rouletteDash.setDescription(`You **hit**!`)
                        rouletteDash.setFooter({text: `You have won ${betAmt} coins.`});
                    } else {
                        await profileModel.findOneAndUpdate (
                            { userId: id },
                            { $inc: { coins: -betAmt, }, }
                        );
                        rouletteDash.setDescription(`You **missed**!`)
                        rouletteDash.setFooter({text: `You have lost ${betAmt} coins.`});
                    }
                    collector2.stop();
                    return await interaction.editReply({ embeds : [rouletteDash] , components: [], files: [] });
                });

                collector2.on('end', (collected, reason) => {
                    if (reason === 'time') {
                        rouletteDash.setDescription(`You timed out!`);
                        rouletteDash.setFooter({text: `You have bet ${betAmt} coins.`});
                        interaction.channel.send({ embeds: [rouletteDash], components: [], files: [] });
                    }
                });
                collector.stop();
                return;
                ///
            } 
        })
        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                rouletteDash.setDescription(`You timed out!`);
                rouletteDash.setFooter({text: `You have bet ${betAmt} coins.`});
                interaction.channel.send({ embeds: [rouletteDash], components: [], files: [] });
            }
        });
    },
}
