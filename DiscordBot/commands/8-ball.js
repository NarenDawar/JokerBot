const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const { default: axios } = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("8-ball")
        .setDescription("Get a random 8 ball message."),
    async execute(interaction) {
        await interaction.deferReply();
        
        axios.get("https://eightballapi.com/api",{

        }).then(data => interaction.editReply(data.data))
        .catch(err => console.error(err))

    },
}