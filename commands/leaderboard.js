const { SlashCommandBuilder, EmbedBuilder, EmbedAssertions } = require('discord.js');
const { User } = require("../utils/schemas")
const {currencyPrefix} = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaderboard')
        .setDescription('Show top members of the server who owns the most coins'),
        async execute(interaction){
            //Get all useers from data and filter out those which are present in the server
            const users = await User.find()

            //sort users
            const sortedUsers = users.sort((a,b) => {
                return (b.wallet + b.bank) - (a.wallet + a.bank)
            }).slice(0, 5)
            
            const lb = new EmbedBuilder()
                .setAuthor({name: `Global Leaderboard`})
                .setColor('Yellow')
                .setDescription( `• #1: 🥇 <@${sortedUsers[0].id}> : ${currencyPrefix} ${sortedUsers[0].wallet + sortedUsers[0].bank}
                                \n• #2:🥈 <@${sortedUsers[1].id}> : ${currencyPrefix} ${sortedUsers[1].wallet + sortedUsers[1].bank}
                                \n• #3: 🥉 <@${sortedUsers[2].id}> : ${currencyPrefix} ${sortedUsers[2].wallet + sortedUsers[2].bank}
                                \n• #4: <@${sortedUsers[3].id}> : ${currencyPrefix} ${sortedUsers[3].wallet + sortedUsers[3].bank}
                                \n• #5: <@${sortedUsers[4].id}> : ${currencyPrefix} ${sortedUsers[4].wallet + sortedUsers[4].bank}`

                )
            

            return interaction.reply({ embeds: [lb] })
        }    
    }