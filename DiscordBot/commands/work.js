const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const profileModel = require("../models/profileSchema");
const parseMilliseconds = require("parse-ms-2");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Gives you a random amount of coins for your hard (or not) work!"),
    async execute(interaction, profileData) {
            const { embedColor, jobTitle, workLastUsed } = profileData;
            const { id } = interaction.user;

            let workDash = new EmbedBuilder()
                .setTitle('Hourly Wage 👷')
                .setColor(embedColor)
                .setTimestamp();

            const cooldown = 60000;
            const timeLeft = cooldown - (Date.now() - workLastUsed);

            if (timeLeft > 0) {
                const { minutes, seconds } = parseMilliseconds(timeLeft);
                workDash.setDescription(`Your next shift starts in **${minutes} mins ${seconds} secs**`);
                return await interaction.reply({ embeds: [workDash] });
            }

            const jobMap = new Map([
                ['Construction', 1],
                ['Construction Worker', 1],
                ['Miner', 1.5],
                ['Professor', 2],
                ['Engineer', 2.5],
                ['Scientist', 3],
                ['Real Estate Agent', 5],
                ['Manager', 7],
                ['CEO', 9],
                ['Mars Agent', 11],
                ['Celebrity', 15],
                ['Multi-Dimensional Spy', 20]
            ]);

            await interaction.deferReply();

            const randomNumber = Math.floor((Math.random() * (100 - 50 + 1) + 50) * jobMap.get(jobTitle));

            await profileModel.findOneAndUpdate(
                { userId: id },
                {
                    $set: { workLastUsed: Date.now(), },
                    $inc: { coins: randomNumber, }
                },
            );

            workDash.setDescription(`Congratulations! As a ${jobTitle}, you earned **${randomNumber}** coins!`);
            await interaction.editReply({ embeds: [workDash] });
    },
};
