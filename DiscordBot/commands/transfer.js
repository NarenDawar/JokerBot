const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const profileModel = require("../models/profileSchema");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("transfer")
        .setDescription("Sends money to person of choice.")
        .addUserOption((option) => 
        option
            .setName("user")
            .setDescription("User you want to recieve the money.")
            .setRequired(true)
        )
        .addIntegerOption((option) => 
        option
            .setName("amount")
            .setDescription("Amount of coins you want to send.")
            .setRequired(true)
            .setMinValue(1)
        ),
    async execute(interaction, profileData) {
        const recievingUser = interaction.options.getUser("user");
        const donationAmt = interaction.options.getInteger("amount");

        const now = new Date();
        const currentDateTime = now.toLocaleString();

        const { coins } = profileData;
        const { embedColor } = profileData;;

        let transferDash = new EmbedBuilder()
            .setTitle('Transfer Coins')
            .setColor(embedColor)
            .setFooter({text: `As of ${ currentDateTime }`});

        if (coins < donationAmt) {
            await interaction.deferReply({ ephemeral: true});
            transferDash.setDescription(`You do not have ${donationAmt} coins.`);
            return await interaction.reply({ embeds : [transferDash]});
        }


        const recievingUserData = await profileModel.findOneAndUpdate(
            {
                userId: recievingUser.id,
            },
            {
                $inc: {
                    coins: donationAmt,
                },
            }
        );

        if(!recievingUserData) {
            await interaction.deferReply({ ephemeral: true });
            transferDash.setDescription(`**${recievingUser.username}** is not in the system.`);
            return await interaction.editReply({ embeds : [transferDash]});
        }

        await interaction.deferReply();

        await profileModel.findOneAndUpdate (
            {
                userId: interaction.user.id,
            },
            {
                $inc: {
                    coins: -donationAmt,
                },
            }
        );
        transferDash.setDescription(`You have donated **${donationAmt}** coins to **${recievingUser.username}**.`);
        interaction.editReply({ embeds : [transferDash]});
    },
};