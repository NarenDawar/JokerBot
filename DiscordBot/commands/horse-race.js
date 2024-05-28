const { SlashCommandBuilder, EmbedBuilder,ActionRowBuilder, ButtonBuilder, ButtonStyle} = require("discord.js");
const { minBet, maxBet } = require("../globalValues.json");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("horse-race")
        .setDescription("Bet on a race of three horses. Winning probabilities change every time!")
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

        const horses = [
            { name: 'Thunder', probability: 0 },
            { name: 'Blaze', probability: 0 },
            { name: 'Swift', probability: 0 },
        ];

        let totalProbability = 0;
        for (const horse of horses) {
            horse.probability = Math.random(); // Generate a random probability
            totalProbability += horse.probability;
    }
    // Normalize probabilities to ensure the total equals 1.0
        for (const horse of horses) {
            horse.probability /= totalProbability;
        }

        const horseDash = new EmbedBuilder()
            .setTitle('Horse Race')
            .setColor(embedColor)
            .setDescription(
                `Pick a horse to bet on.\n**${horses[0].name}** has a winning probability of **${Math.round(horses[0].probability*100)}%**\n` +
                `**${horses[1].name}** has a winning probability of **${Math.round(horses[1].probability*100)}%**\n` +
                `**${horses[2].name}** has a winning probability of **${Math.round(horses[2].probability*100)}%**\n`)
            .setFooter({text: `You have bet ${betAmt} coins.`});

        const thunderButton = new ButtonBuilder()
			.setCustomId('Thunder')
			.setLabel('Thunder')
			.setStyle(ButtonStyle.Primary);

		const blazeButton = new ButtonBuilder()
			.setCustomId('Blaze')
			.setLabel('Blaze')
			.setStyle(ButtonStyle.Primary);

        const swiftButton = new ButtonBuilder()
			.setCustomId('Swift')
			.setLabel('Swift')
			.setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder()
			.addComponents(thunderButton, blazeButton, swiftButton);

            await interaction.editReply({
                components: [row],
                embeds: [horseDash]
            });

        if (coins < betAmt) {
            horseDash.setDescription(`You do not have ${betAmt} coins.`);
            return await interaction.editReply({ embeds : [horseDash]});
        }
      
        if (!(betAmt >= minBet) || !(betAmt <= maxBet)) {
            horseDash.setDescription(`Invalid amount. Minimum bet amount is ${minBet} and maximum bet amount is ${maxBet}`);
            return await interaction.editReply({ embeds : [horseDash]});
        }
        const message = await interaction.fetchReply();

        const filter = (i) => i.user.id === interaction.user.id && (i.customId === 'Blaze' || i.customId === 'Swift' || i.customId === 'Thunder');
        const collector = message.createMessageComponentCollector({ filter, time: 30000});


        collector.on('collect', async (i) => {
            let winner;

            const randomNumber = Math.random();
            let cumulativeProbability = 0;
            for (const horse of horses) {
                cumulativeProbability += horse.probability;
                if (randomNumber <= cumulativeProbability) {
                    winner =  horse.name;
                    break; // Return the horse that wins the race
                }
            }

            if(i.customId === winner) {
                horseDash.setDescription(`You **hit**!`);
                horseDash.setFooter({text: `You won ${betAmt} coins.`});
                await profileModel.findOneAndUpdate (
                    { userId: id },
                    { $inc: { coins: betAmt, numOfWins: 1}, }
                );
                await i.update({ embeds : [horseDash] , components: [] });
                collector.stop();
                return;
            } else {
                horseDash.setDescription(`You **missed**!`);
                horseDash.setFooter({text: `You lost ${betAmt} coins.`});
                await profileModel.findOneAndUpdate (
                    { userId: id },
                    { $inc: { coins: -betAmt }, }
                );
                await i.update({ embeds : [horseDash] , components: [] });
                collector.stop();
                return;
                }
            })

        collector.on('end', (collected, reason) => {
            if (reason === 'time') {
                horseDash.setDescription(`You timed out!`);
                horseDash.setFooter({text: `You have bet ${betAmt} coins.`});
                interaction.channel.send({ embeds: [horseDash], components: [], files: [] });
            }
        });
    },
};
