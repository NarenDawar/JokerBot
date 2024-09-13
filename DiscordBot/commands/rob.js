const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const parseMilliseconds = require("parse-ms-2");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("rob")
        .setDescription("Attempt to rob another user for coins.")
        .addUserOption(option => 
            option.setName("target")
                .setDescription("The user you want to rob")
                .setRequired(true)
        ),

    async execute(interaction, profileData) {
        const targetUser = interaction.options.getUser("target");
        const { id } = interaction.user;
        const targetId = targetUser.id;
        const {embedColor, robLastUsed} = profileData;

        const cooldown = 86400000;
        const timeLeft = cooldown - (Date.now() - robLastUsed);

        const robDash = new EmbedBuilder()
            .setTitle('Rob 🤑')
            .setColor(embedColor);

        if (timeLeft > 0) {
            const { hours, minutes, seconds } = parseMilliseconds(timeLeft);
            robDash.setDescription(`Your next rob is available in **${hours} hrs ${minutes} min ${seconds} sec**`);
            await interaction.reply({ embeds : [robDash]});
            return;
        }


        if (targetId === id) {
            robDash.setDescription("You cannot rob yourself.");
            return await interaction.reply({embeds: [robDash]});
        }

        await interaction.deferReply();

        const userProfile = await profileModel.findOne({ userId: id });
        const targetProfile = await profileModel.findOne({userId: targetId});

        // Get profiles of the user and target
        if (!targetProfile) {
            robDash.setDescription("The target user does not have a profile yet.");
            return await interaction.editReply({embeds: [robDash]});
        }

        // Check if the user and target have profiles

        if (targetProfile.coins < 500) {
            robDash.setDescription("The target user does not have enough coins to be robbed.");
            return await interaction.editReply({embeds: [robDash]});
        }

        // Randomize robbery outcome
        const success = Math.random() < 0.3; 
        const robberyAmount = Math.floor(Math.random() * 50) + 50; // Rob between 50 and 150 coins

        if (success) {
            // Success scenario
            await profileModel.findOneAndUpdate(
                    { userId: id },
                    { $inc: { coins: robberyAmount } }
                );
            await profileModel.findOneAndUpdate(
                    { userId: targetId },
                    { $inc: { coins: -robberyAmount } }
                );

            robDash.setDescription(`Success! You robbed **${robberyAmount}** coins from <@${targetId}>.`);
        } else {
            // Failure scenario
            robDash.setDescription(`Failed! You couldn't rob <@${targetId}>. Better luck next time.`);
        }

        await interaction.editReply({ embeds: [robDash] });
    },
};
