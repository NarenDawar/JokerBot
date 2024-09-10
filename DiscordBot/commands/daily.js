const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const parseMilliseconds = require("parse-ms-2");
const profileModel = require("../models/profileSchema");
const { dailyMin, dailyMax } = require("../globalValues.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Get free coins every day."),
        
    async execute(interaction, profileData) {
        const { id } = interaction.user;
        const { dailyLastUsed } = profileData;
        const {embedColor} = profileData;

        const now = new Date();
        const currentDateTime = now.toLocaleString();

        let dailyDash = new EmbedBuilder()
        .setTitle('Daily Coins 💸')
        .setColor(embedColor);

        const cooldown = 86400000;
        const timeLeft = cooldown - (Date.now() - dailyLastUsed);

        if (timeLeft > 0) {
            const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
            dailyDash.setDescription(`Your next daily is available in **${hours} hrs ${minutes} min ${seconds} sec**`)
            dailyDash.setFooter({text: `As of: ${ currentDateTime }`});
            await interaction.reply({ embeds : [dailyDash]});
            return;
        }

        await interaction.deferReply();

        const randomAmt = Math.floor(
            Math.random() * (dailyMax - dailyMin + 1) + dailyMin
        );

        try {
            await profileModel.findOneAndUpdate(
                { userId: id },
                {
                    $set: {
                        dailyLastUsed: Date.now(),
                    },
                    $inc: {
                        coins: randomAmt,
                    },
                },
                { new: true } // Ensure you get the updated document
            );

            dailyDash.setDescription(`You redeemed ${randomAmt} coins!`);
            dailyDash.setFooter({text: `As of: ${ currentDateTime }`});
            await interaction.editReply({ embeds : [dailyDash]});

        } catch (err) {
            console.log(err);
            await interaction.editReply('An error occurred while processing your request.');
        }
    },
};
