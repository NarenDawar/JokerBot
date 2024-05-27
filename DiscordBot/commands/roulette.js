const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("roulette")
        .setDescription("Returns your balance (number of coins!)")
        .addSubcommand((subcommand) => 
        subcommand
            .setName("colors")
            .setDescription("Pick a color, 50/50 chance.")
            .addStringOption((option) => 
            option
                .setName("color")
                .setDescription("Color you want to bet on.")
                .setRequired(true)
                .addChoices(
                    {name: "red", value: "red"},
                    {name: "black", value: "black"}
                )
            )
            .addIntegerOption((option) => 
            option
                .setName("amount")
                .setDescription("Amount you'd like to bet.")
                .setMaxValue(100000)
                .setRequired(true)
                .setMinValue(1)))
        .addSubcommand((subcommand) => 
        subcommand
            .setName("numbers")
            .setDescription("Pick a number 0-36, 1/37 chance. Receive 5x your initial bet upon a win.")
            .addIntegerOption((option) => 
            option
                .setName("number")
                .setDescription("Number you want to bet on.")
                .setRequired(true)
                .setMaxValue(36)
                .setMinValue(0))
            .addIntegerOption((option) => 
            option
                .setName("amount")
                .setDescription("Amount you'd like to bet.")
                .setRequired(true)
                .setMaxValue(100000)
                .setMinValue(1))),
    async execute(interaction, profileData) {
        const userPick = interaction.options.getSubcommand();
        await interaction.deferReply();

        const { id } = interaction.user;
        const { coins } = profileData;
        const { embedColor } = profileData;

        const now = new Date();
        const currentDateTime = now.toLocaleString();

        let rouletteDash = new EmbedBuilder()
            .setTitle('Roulette')
            .setColor(embedColor)
            .setFooter({text: `You have bet ${betAmt} coins.`});

        if (userPick === "colors") {
            const randomNum = Math.round(Math.random());
            const result = (randomNum ? "red" : "black").toUpperCase();
            const choice = interaction.options.getString("color");
            const betAmt = interaction.options.getInteger("amount");


            if (choice === result) {
                 profileModel.findOneAndUpdate (
                    { userId: id },
                    { $inc: { coins: betAmt, numOfWins: 1 } }
            );
            rouletteDash.setDescription(`The ball landed on a **${result}**! Congrats!`);
            rouletteDash.setFooter({text: `You have won ${betAmt} coins.`});
        } else {
                await profileModel.findOneAndUpdate (
                    { userId: id },
                    { $inc: { coins: -betAmt } }
                );
                rouletteDash.setDescription(`Unfortunately, the ball landed on **${result}**. You have lost **${betAmt}** coins!`);
                rouletteDash.setFooter({text: `You have lost ${betAmt} coins.`});
            }
            await interaction.editReply({ embeds : [rouletteDash] });
        }

        if (userPick === "numbers") {
            const randomNumber = Math.floor(Math.random() * 37);
            const betAmt = interaction.options.getInteger("amount");

            const choice = interaction.options.getInteger("number");

            if(choice === randomNumber) {
                await profileModel.findOneAndUpdate (
                    { userId: id },
                    { $inc: { coins: 5*betAmt, numOfWins: 1 } }
                )
                rouletteDash.setDescription(`The ball landed on **${ randomNumber }**! Amazing luck!`);
                rouletteDash.setFooter({text: `You have won ${5*betAmt} coins.`});
            } else {
                await profileModel.findOneAndUpdate (
                    { userId: id },
                    { $inc: { coins: -betAmt } }
                )
                rouletteDash.setDescription(`Unfortunately, the ball landed on **${ randomNumber }**. Better luck next time! You've lost **${ betAmt }** coins.`);
                rouletteDash.setFooter({text: `You have lost ${5*betAmt} coins.`});
            }

            return await interaction.editReply({embeds : [rouletteDash]});
        }
    },
}
