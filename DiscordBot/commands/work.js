const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const profileModel = require("../models/profileSchema");
const parseMilliseconds = require("parse-ms-2");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("work")
        .setDescription("Gives you a random amount of coins (50-100) for your hard (or not) work!"),
    async execute(interaction, profileData) {
        const {embedColor, jobTitle} = profileData;
        const { workLastUsed } = profileData;
        const {id} = interaction.user;

        let workDash = new EmbedBuilder()
        .setTitle('Hourly Wage 👷')
        .setColor(embedColor)
        .setTimestamp();

        const cooldown = 600000;
        const timeLeft = cooldown - (Date.now() - workLastUsed);

        const jobMap = new Map();
        jobMap.set('Construction', 1);
        jobMap.set('Miner', 1.5);
        jobMap.set('Professor', 2);
        jobMap.set('Engineer', 2.5);
        jobMap.set('Scientist', 3);
        jobMap.set('Real Estate Agent', 5);
        jobMap.set('Manager', 7);
        jobMap.set('CEO', 9);
        jobMap.set('Mars Agent', 11);
        jobMap.set('Celebrity', 15);
        jobMap.set('Multi-Dimensional Spy', 20);

        const randomNumber = Math.floor((Math.floor(Math.random() * (100 - 50 + 1)) + 50)*jobMap.get(jobTitle));

        if (timeLeft > 0) {
            const { minutes, seconds } = parseMilliseconds(timeLeft);

            workDash.setDescription(`Your next shift starts in **${minutes} mins ${seconds} secs**`);
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