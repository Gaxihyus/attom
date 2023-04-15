const { SlashCommandBuilder, EmbedBuilder, EmbedAssertions, ActionRowBuilder, ButtonBuilder, ButtonStyle, InteractionResponse } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { User } = require("../utils/schemas")
const {currencyPrefix} = require("../config.json");

var players = [];

module.exports = {
	data: new SlashCommandBuilder()
		.setName('russianroulette')
		.setDescription('Start a russian roulette game with your friends!')
        .addNumberOption(option => option
            .setName('amount')
            .setDescription("Amount you're willing to gamble")
            .setRequired(true)
            .setMinValue(250)    
        ),
        
            
	async execute(interaction) {
        
        const user = interaction.member.user
        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })
        amount = interaction.options.getNumber("amount")

        if (userData.wallet < amount) return interaction.reply({
            embeds: [ new EmbedBuilder().setDescription(`💰 You don't have enough money on your wallet to gamble! Maybe try gambling less...`) ],
            ephemeral: true
        })

        var currentPlayers = "";
        players[players.length] = interaction.user.id;
        for(a = 0; a < players.length; a++)
        {
            if(interaction.user.id === players[a]) players.splice(a, a); 
        }
        console.log(players);

            currentPlayers = `Current Players (${players.length}):`

            for(i = 0; i < players.length; i++)
            {
                currentPlayers += ` <@${players[i]}>`
            }

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('enter')
                .setLabel('Join the game!')
                .setStyle(ButtonStyle.Danger),
        )
        const lobbyEmbed = new EmbedBuilder()
            .setTitle('Press the button to enter the russian roulette!')
            .setDescription(`Current prize pool: \`${currencyPrefix} ${interaction.options.getNumber('amount')}\`\n${currentPlayers}`)

        interaction.reply({ embeds: [lobbyEmbed], components: [row]})

        

        const filter = i => i.customId === 'enter'// && i.user.id !== interaction.user.id;

        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000});


        collector.on('collect', async (user) => {

            for(a = 0; a < players.length; a++)
            {
                if(user.user.id === players[a]) players.splice(a, a); 
            }
            const userData = await User.findOne({ id: user.user.id })
            for(a = 0; a < players.length; a++)
            {
                if(user.user.id === players[a]) players.splice(a, a); 
            }
            if(userData.wallet > interaction.options.getNumber('amount'))players[players.length] = user.user.id;

            console.log(players);
            currentPlayers = `Current Players (${players.length}):`
            for(i = 0; i < players.length; i++)
            {
                currentPlayers += ` <@${players[i]}>`
            }
        });

        collector.on('collect', async i => {
            const lobbyEmbed2 = new EmbedBuilder()
            .setTitle('Press the button to enter the russian roulette!')
            .setDescription(`Current prize pool: \`${currencyPrefix} ${interaction.options.getNumber('amount') * players.length}\`\n${currentPlayers}`)
            await i.update({ embeds: [lobbyEmbed2], components: [row]})
        });

        collector.on('end', async i => {
            
            const roll = Math.floor((Math.random() * players.length ))

            var shot = "";
            console.log(roll)

            //EMBED ANIMATION
            for(r = 0; r <= roll; r++)
            {
                if(r !== roll){

                shot += ` <@${players[r]}> has pulled the trigger...`;

                gameEmbed = new EmbedBuilder()
                .setTitle(`The roulette has begun! Entry: \`${currencyPrefix} ${interaction.options.getNumber('amount')}\``)
                .setDescription(`Current prize pool: \`${currencyPrefix} ${interaction.options.getNumber('amount') * players.length}\`\n${shot}`)
                await interaction.editReply( {embeds: [gameEmbed] });

                await wait(200)
                shot += "and survived! \n"

                gameEmbed = new EmbedBuilder()
                .setTitle('The roulette has begun!')
                .setDescription(`Current prize pool: \`${currencyPrefix} ${interaction.options.getNumber('amount') * players.length}\`\n${shot}`)
    
                await interaction.editReply( {embeds: [gameEmbed] });

                await wait(200)}
                
                else {
                    if(r === roll){
                    var gameEmbed = new EmbedBuilder()
                    .setTitle('The roulette has begun!')
                    .setDescription(`Current prize pool: \`${currencyPrefix} ${interaction.options.getNumber('amount') * players.length}\`\n${shot}`)
    
                    await interaction.editReply( {embeds: [gameEmbed] });
    
                    shot += ` <@${players[r]}> has pulled the trigger...`;
    
                    gameEmbed = new EmbedBuilder()
                    .setTitle('The roulette has begun!')
                    .setDescription(`Current prize pool: \`${currencyPrefix} ${interaction.options.getNumber('amount') * players.length}\`\n${shot}`)
                    await interaction.editReply( {embeds: [gameEmbed] });
    
                    await wait(200)
                    shot += `and died! Everyone else got ${interaction.options.getNumber('amount')/(players.length-1)}` 
    
                    gameEmbed = new EmbedBuilder()
                    .setTitle('The roulette has begun!')
                    .setDescription(`Current prize pool: \`${currencyPrefix} ${interaction.options.getNumber('amount') * players.length}\`\n${shot}`)
        
                    await interaction.editReply( {embeds: [gameEmbed] });
    
                    await wait(200)}

                }
            }

            //PAYOUT
            for(k = 0; k < players.length; k++)
            {
                if(k !== roll)
                {  
                    const userData = await User.findOne({ id: players[k] })
                    userData.wallet += Math.floor(interaction.options.getNumber('amount')/(players.length - 1))
                    userData.save();
                }
                if(k === roll && players.length > 1){
                    const userData = await User.findOne({ id: players[roll] })
                    userData.wallet -= interaction.options.getNumber('amount');
                    userData.save();

                }
            }


        });
    }  
} 