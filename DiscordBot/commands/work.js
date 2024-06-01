const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const profileModel = require("../models/profileSchema");
const parseMilliseconds = require("parse-ms-2");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Gives you a random amount of coins (50-100) for your hard (or not) work!"),
    async execute(interaction, profileData) {
        const {coins, embedColor} = profileData;
        const { workLastUsed } = profileData;
        const {id} = interaction.user;
        const randomNumber = Math.floor(Math.random() * (100 - 50 + 1)) + 50;


        let workDash = new EmbedBuilder()
        .setTitle('Hourly Wage 👷')
        .setColor(embedColor)
        .setTimestamp();

        const cooldown = 3600000;
        const timeLeft = cooldown - (Date.now() - workLastUsed);

        if (timeLeft > 0) {
            const { hours, minutes, seconds } = parseMilliseconds(timeLeft);

            workDash.setDescription(`Your next shift starts in **${hours} hrs ${minutes} min ${seconds} sec**`);
            return await interaction.reply({ embeds : [workDash]});
        }

        await profileModel.findOneAndUpdate(
            { userId: id },
            {
                $set: {
                    workLastUsed: Date.now(),
                },
                $inc: {
                    coins: randomNumber,
                },
            },
        );

        workDash.setDescription(`Congratulations! Your work just earned you **${randomNumber}** coins!`);
        return await interaction.reply({ embeds : [workDash]});
    },
}