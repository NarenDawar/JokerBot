const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const profileModel = require("../models/profileSchema");
const { embedColorPrice, customTitlePrice, customPhrasePrice, 
    minerPrice, professorPrice, engineerPrice, scientistPrice, 
    rEAPrice, managerPrice, CEOPrice, marsAgentPrice, 
    celebrityPrice, multiDSPrice, mysteryBoxPrice} = require("../shopPrices.json");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("shop")
        .setDescription("Shop to spend your coins.")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("embed-color")
                .setDescription(`Purchase a new embed color. Price : ${embedColorPrice} coins.`)
                .addStringOption((option) => 
                    option
                        .setName("color")
                        .setDescription("Choose the desired color of your embed.")
                        .addChoices(
                            { name: "Aqua", value: '#1abc9c' },
                            { name: "Green", value: '#57f287' },
                            { name: "Blue", value: '#3498db' },
                            { name: "Purple", value: '#9b59b6' },
                            { name: "Gold", value: '#f1c40f' },
                            { name: "Orange", value: '#e67e22' },
                            { name: "Yellow", value: '#ffff00' },

                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("custom-title")
                .setDescription(`Purchase a new custom title. Price : ${customTitlePrice} coins.`)
                .addStringOption((option) => 
                    option
                        .setName("title")
                        .setDescription("Choose the desired title.")
                        .addChoices(
                            { name: "Card Connoisseur", value: "Card Connoisseur" },
                            { name: "Deck Dynamo", value: "Deck Dynamo" },
                            { name: "Queen of Diamonds", value: "Queen of Diamonds" },
                            { name: "Shuffle Master", value: "Shuffle Master" },
                            { name: "Ace of Spades", value: "Ace of Spades" },
                            { name: "Queen of Hearts", value: "Queen of Hearts" },
                            { name: "The King of Diamonds", value: "The King of Diamonds" },
                            { name: "Jackpot Juggernaut", value: "Jackpot Juggernaut" },
                            { name: "High Roller", value: "High Roller" },
                            { name: "Wild Card Warrior", value: "Wild Card Warrior" },
                            { name: "Card Shark", value: "Card Shark" },
                            { name: "The King of Hearts", value: "The King of Hearts" },
                            { name: "Jack of All Trades", value: "Jack of All Trades" },
                            { name: "Winning Whiz", value: "Winning Whiz" },
                            { name: "Ace Adventurer", value: "Ace Adventurer" },
                            { name: "Queen of Spades", value: "Queen of Spades" },
                            { name: "Card Crusader", value: "Card Crusader" },
                            { name: "High-Stakes Hero", value: "High-Stakes Hero" },
                            { name: "Card Czar", value: "Card Czar" },
                            { name: "Diamond Daredevil", value: "Diamond Daredevil" },
                            { name: "Dark Dealer", value: "Dark Dealer" },
                            { name: "Dark Duchess", value: "Dark Duchess" },
                            { name: "The Ace", value: "The Ace" },
                            { name: "The King of Spades", value: "The King of Spades" },
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("custom-phrase")
                .setDescription(`Purchase a new custom phrase. Price : ${customPhrasePrice} coins.`)
                .addStringOption((option) => 
                    option
                        .setName("phrase")
                        .setDescription("Choose the desired phrase.")
                        .addChoices(
                            { name: "I'm addicted.", value: "I'm addicted." },
                            { name: "I am heavily in debt.", value: "I am heavily in debt." },
                            { name: "I ALWAYS go all in.", value: "I ALWAYS go all in." },
                            { name: "Uno, dos, tres... too many wins to count.", value: "Uno, dos, tres... too many wins to count." },
                            { name: "5 years and counting..", value: "5 years and counting.." },
                            { name: "I'm yet to lose.", value: "I'm yet to lose." },
                            { name: "Put everything on red.", value: "Put everything on red." },
                            { name: "All my money is from gambling.", value: "All my money is from gambling." },
                            { name: "I hear a jackpot calling!", value: "I hear a jackpot calling!" },
                            { name: "My only skill is blackjack.", value: "Wild Card WarriorMy only skill is blackjack." },
                            { name: "It was never luck.", value: "It was never luck." },
                            { name: "I was born for this.", value: "I was born for this." }
                        )
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("job")
                .setDescription(`Upgrade your job. Prices vary! This affects your /work payments.`)
                .addStringOption((option) => 
                    option
                        .setName("job-title")
                        .setDescription("Choose the desired phrase.")
                        .addChoices(
                            { name: "Miner", value: "Miner" },
                            { name: "Professor", value: "Professor" },
                            { name: "Engineer", value: "Engineer" },
                            { name: "Scientist", value: "Scientist" },
                            { name: "Real Estate Agent", value: "Real Estate Agent" },
                            { name: "Manager", value: "Manager" },
                            { name: "CEO", value: "CEO" },
                            { name: "Mars Agent", value: "Mars Agent" },
                            { name: "Celebrity", value: "Celebrity" },
                            { name: "Multi-Dimensional Spy", value: "Multi-Dimensional Spy" },
                        )
                        .setRequired(true)
                )
        ),
        
    async execute(interaction, profileData) {
        const { coins, userId, embedColor } = profileData;
        const shopCommand = interaction.options.getSubcommand();

        let shopEmbed = new EmbedBuilder()
            .setTitle("Shop")
            .setColor(embedColor)
            .setTimestamp();

        if (shopCommand === "embed-color") {
            const colorPicked = interaction.options.getString("color");

            if (coins < embedColorPrice) {
                await interaction.deferReply();
                shopEmbed.setDescription(`You need ${embedColorPrice} coins to buy a custom color.`);
                return await interaction.editReply(
                    {
                        embeds : [shopEmbed]
                    }
                );
            }

            await interaction.deferReply();

            await profileModel.findOneAndUpdate(
                {
                    userId,
                },
                {
                    $inc: {
                        coins: -embedColorPrice,
                    },
                    $set: {
                        embedColor: colorPicked,
                    }
                }
            );
            shopEmbed.setDescription(`You have successfully changed your embed color to: **${colorPicked}**`)
            return interaction.editReply({ embeds : [shopEmbed]});
        }
        else if (shopCommand === "custom-title") {
            const titlePicked = interaction.options.getString("title");

            if (coins < embedColorPrice) {
                await interaction.deferReply();
                shopEmbed.setDescription(`You need ${customTitlePrice} coins to buy a custom title.`);
                return await interaction.editReply(
                    {
                        embeds : [shopEmbed]
                    }
                );
            }

            await interaction.deferReply();

            await profileModel.findOneAndUpdate(
                {
                    userId,
                },
                {
                    $inc: {
                        coins: -customTitlePrice,
                    },
                    $set: {
                        customTitle: titlePicked,
                    }
                }
            );
            shopEmbed.setDescription(`You have successfully changed your title to: **${titlePicked}**`);
            return interaction.editReply({ embeds : [shopEmbed]});
        }

        else if (shopCommand === "custom-phrase") {
            const phrasePicked = interaction.options.getString("phrase");

            if (coins < embedColorPrice) {
                await interaction.deferReply();
                shopEmbed.setDescription(`You need ${customPhrasePrice} coins to buy a custom phrase.`);
                return await interaction.editReply(
                    {
                        embeds : [shopEmbed]
                    }
                );
            }

            await interaction.deferReply();

            await profileModel.findOneAndUpdate(
                {
                    userId,
                },
                {
                    $inc: {
                        coins: -customPhrasePrice,
                    },
                    $set: {
                        customPhrase: phrasePicked,
                    }
                }
            );
            shopEmbed.setDescription(`You have successfully changed your phrase to: **${phrasePicked}**`);
            return interaction.editReply({ embeds : [shopEmbed]});
        }

        else if (shopCommand === "job") {
            const jobPicked = interaction.options.getString("job-title");

            if(jobPicked === "Miner") {
                if (coins < minerPrice) {
                    await interaction.deferReply();
                    shopEmbed.setDescription(`You need ${minerPrice} coins to get this job.`);
                    return await interaction.editReply(
                        {
                            embeds : [shopEmbed]
                        }
                    );
                }
    
                await interaction.deferReply();
    
                await profileModel.findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $inc: {
                            coins: -minerPrice,
                        },
                        $set: {
                            jobTitle: jobPicked,
                        }
                    }
                );
                shopEmbed.setDescription(`You have successfully changed your job to: **${jobPicked}**`);
                return interaction.editReply({ embeds : [shopEmbed]});
            }

            else if(jobPicked === "Professor") {
                if (coins < professorPrice) {
                    await interaction.deferReply();
                    shopEmbed.setDescription(`You need ${professorPrice} coins to get this job.`);
                    return await interaction.editReply(
                        {
                            embeds : [shopEmbed]
                        }
                    );
                }
    
                await interaction.deferReply();
    
                await profileModel.findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $inc: {
                            coins: -professorPrice,
                        },
                        $set: {
                            jobTitle: jobPicked,
                        }
                    }
                );
                shopEmbed.setDescription(`You have successfully changed your job to: **${jobPicked}**`);
                return interaction.editReply({ embeds : [shopEmbed]});
            }

            else if(jobPicked === "Engineer") {
                if (coins < engineerPrice) {
                    await interaction.deferReply();
                    shopEmbed.setDescription(`You need ${engineerPrice} coins to get this job.`);
                    return await interaction.editReply(
                        {
                            embeds : [shopEmbed]
                        }
                    );
                }
    
                await interaction.deferReply();
    
                await profileModel.findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $inc: {
                            coins: -engineerPrice,
                        },
                        $set: {
                            jobTitle: jobPicked,
                        }
                    }
                );
                shopEmbed.setDescription(`You have successfully changed your job to: **${jobPicked}**`);
                return interaction.editReply({ embeds : [shopEmbed]});
            }

            else if(jobPicked === "Scientist") {
                if (coins < scientistPrice) {
                    await interaction.deferReply();
                    shopEmbed.setDescription(`You need ${scientistPrice} coins to get this job.`);
                    return await interaction.editReply(
                        {
                            embeds : [shopEmbed]
                        }
                    );
                }
    
                await interaction.deferReply();
    
                await profileModel.findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $inc: {
                            coins: -scientistPrice,
                        },
                        $set: {
                            jobTitle: jobPicked,
                        }
                    }
                );
                shopEmbed.setDescription(`You have successfully changed your job to: **${jobPicked}**`);
                return interaction.editReply({ embeds : [shopEmbed]});
            }

            else if(jobPicked === "Real Estate Agent") {
                if (coins < rEAPrice) {
                    await interaction.deferReply();
                    shopEmbed.setDescription(`You need ${rEAPrice} coins to get this job.`);
                    return await interaction.editReply(
                        {
                            embeds : [shopEmbed]
                        }
                    );
                }
    
                await interaction.deferReply();
    
                await profileModel.findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $inc: {
                            coins: -rEAPrice,
                        },
                        $set: {
                            jobTitle: jobPicked,
                        }
                    }
                );
                shopEmbed.setDescription(`You have successfully changed your job to: **${jobPicked}**`);
                return interaction.editReply({ embeds : [shopEmbed]});
            }

            else if(jobPicked === "Manager") {
                if (coins < managerPrice) {
                    await interaction.deferReply();
                    shopEmbed.setDescription(`You need ${managerPrice} coins to get this job.`);
                    return await interaction.editReply(
                        {
                            embeds : [shopEmbed]
                        }
                    );
                }
    
                await interaction.deferReply();
    
                await profileModel.findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $inc: {
                            coins: -managerPrice,
                        },
                        $set: {
                            jobTitle: jobPicked,
                        }
                    }
                );
                shopEmbed.setDescription(`You have successfully changed your job to: **${jobPicked}**`);
                return interaction.editReply({ embeds : [shopEmbed]});
            }

            else if(jobPicked === "CEO") {
                if (coins < CEOPrice) {
                    await interaction.deferReply();
                    shopEmbed.setDescription(`You need ${CEOPrice} coins to get this job.`);
                    return await interaction.editReply(
                        {
                            embeds : [shopEmbed]
                        }
                    );
                }
    
                await interaction.deferReply();
    
                await profileModel.findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $inc: {
                            coins: -CEOPrice,
                        },
                        $set: {
                            jobTitle: jobPicked,
                        }
                    }
                );
                shopEmbed.setDescription(`You have successfully changed your job to: **${jobPicked}**`);
                return interaction.editReply({ embeds : [shopEmbed]});
            }

            else if(jobPicked === "CEO") {
                if (coins < CEOPrice) {
                    await interaction.deferReply();
                    shopEmbed.setDescription(`You need ${CEOPrice} coins to get this job.`);
                    return await interaction.editReply(
                        {
                            embeds : [shopEmbed]
                        }
                    );
                }
    
                await interaction.deferReply();
    
                await profileModel.findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $inc: {
                            coins: -CEOPrice,
                        },
                        $set: {
                            jobTitle: jobPicked,
                        }
                    }
                );
                shopEmbed.setDescription(`You have successfully changed your job to: **${jobPicked}**`);
                return interaction.editReply({ embeds : [shopEmbed]});
            }

            else if(jobPicked === "Mars Agent") {
                if (coins < marsAgentPrice) {
                    await interaction.deferReply();
                    shopEmbed.setDescription(`You need ${marsAgentPrice} coins to get this job.`);
                    return await interaction.editReply(
                        {
                            embeds : [shopEmbed]
                        }
                    );
                }
    
                await interaction.deferReply();
    
                await profileModel.findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $inc: {
                            coins: -marsAgentPrice,
                        },
                        $set: {
                            jobTitle: jobPicked,
                        }
                    }
                );
                shopEmbed.setDescription(`You have successfully changed your job to: **${jobPicked}**`);
                return interaction.editReply({ embeds : [shopEmbed]});
            }

            else if(jobPicked === "Celebrity") {
                if (coins < celebrityPrice) {
                    await interaction.deferReply();
                    shopEmbed.setDescription(`You need ${celebrityPrice} coins to get this job.`);
                    return await interaction.editReply(
                        {
                            embeds : [shopEmbed]
                        }
                    );
                }
    
                await interaction.deferReply();
    
                await profileModel.findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $inc: {
                            coins: -celebrityPrice,
                        },
                        $set: {
                            jobTitle: jobPicked,
                        }
                    }
                );
                shopEmbed.setDescription(`You have successfully changed your job to: **${jobPicked}**`);
                return interaction.editReply({ embeds : [shopEmbed]});
            }

            else if(jobPicked === "Multi-Dimensional Spy") {
                if (coins < multiDSPrice) {
                    await interaction.deferReply();
                    shopEmbed.setDescription(`You need ${multiDSPrice} coins to get this job.`);
                    return await interaction.editReply(
                        {
                            embeds : [shopEmbed]
                        }
                    );
                }
    
                await interaction.deferReply();
    
                await profileModel.findOneAndUpdate(
                    {
                        userId,
                    },
                    {
                        $inc: {
                            coins: -multiDSPrice,
                        },
                        $set: {
                            jobTitle: jobPicked,
                        }
                    }
                );
                shopEmbed.setDescription(`You have successfully changed your job to: **${jobPicked}**`);
                return interaction.editReply({ embeds : [shopEmbed]});
            }
        }


    },
}
