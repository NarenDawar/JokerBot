const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const profileModel = require('../models/profileSchema');


module.exports = {
    data: new SlashCommandBuilder()
        .setName("bank")
        .setDescription("Store money and gain interest.")
        .addSubcommand((subcommand) => 
            subcommand
                .setName('deposit')
                .setDescription('Put money in your bank account.')
                .addIntegerOption((option) => 
                    option
                    .setName('amount')
                    .setDescription('Amount to deposit.')
                    .setRequired(true)
                    .setMinValue(1))
                    
                
            )
            .addSubcommand((subcommand) => 
            subcommand
                .setName('withdraw')
                .setDescription('Take money out of your bank account.')
                .addIntegerOption((option) => 
                    option
                    .setName('amount')
                    .setDescription('Amount to withdraw.')
                    .setRequired(true)
                    .setMinValue(1))
            )
            .addSubcommand((subcommand) => 
            subcommand
                .setName('balance')
                .setDescription('View your current balance in the bank.')
            ),
    async execute(interaction, profileData) {
        await interaction.deferReply();
        const userId = interaction.user.id;
        const {coins, bankBalance} = profileData;
        const {embedColor} = profileData;

        let bankDash = new EmbedBuilder()
            .setTitle('Bank 🏦')
            .setColor(embedColor)
            .setTimestamp();

        const subcommand = interaction.options.getSubcommand();

        if(subcommand === 'deposit') {
            const amount = interaction.options.getInteger('amount');

            if(amount > coins) {
                bankDash.setDescription(`You do not have ${amount} coins.`);
                return interaction.editReply({ embeds : [bankDash]});
            }

            await profileModel.findOneAndUpdate (
                {
                    userId,
                },
                {
                    $inc: {
                        coins: -amount,
                        bankBalance: amount
                    },
                }
            );


            bankDash.setDescription(`You have deposited ${amount} coins into the bank.`);
            return interaction.editReply({ embeds : [bankDash]});

            }
        else if(subcommand === 'withdraw') {
            const amount = interaction.options.getInteger('amount');

            if(amount > bankBalance) {
                bankDash.setDescription(`You do not have ${amount} coins in the bank.`);
                return interaction.editReply({ embeds : [bankDash]});
            }

            await profileModel.findOneAndUpdate (
                {
                    userId,
                },
                {
                    $inc: {
                        coins: amount,
                        bankBalance: -amount,
                    },
                }
            );



            bankDash.setDescription(`You have withdrew ${amount} coins from the bank.`);
            return interaction.editReply({ embeds : [bankDash]});
        }

        else if(subcommand === 'balance') {
            bankDash.setDescription(`You have ${bankBalance} coins!`);
            return interaction.editReply({ embeds : [bankDash]});

        }
    },

}