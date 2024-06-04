const {SlashCommandBuilder, EmbedBuilder} = require("discord.js");
const { default: axios } = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("tell-aa-joke")
        .setDescription("Get a randomly generated joke!"),
    async execute(interaction, profileData) {
        await interaction.deferReply();

        const {embedColor} = profileData;

        let jokeDash = new EmbedBuilder()
            .setTitle('Joke 🤣')
            .setColor(embedColor)
            .setTimestamp();
        
        axios.get("https://icanhazdadjoke.com",{
            headers:{
                "Accept":"text/plain"
            }
        }).then(data => interaction.editReply(data.data + " 😆"))
        .catch(err => console.error(err))

    },
}