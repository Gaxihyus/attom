const { SlashCommandBuilder, EmbedBuilder, EmbedAssertions } = require('discord.js');
const wait = require('node:timers/promises').setTimeout;
const { User } = require("../utils/schemas")
const {currencyPrefix} = require("../config.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('slotmachine')
		.setDescription('Start a slot machine game! Win up to 25x your investment.')
        .addNumberOption(option => option
            .setName('amount')
            .setDescription("Amount you're willing to gamble")
            .setRequired(true)
            .setMinValue(250)    
        ),
        
            
	async execute(interaction) {

        const user = interaction.member.user
        amount = interaction.options.getNumber("amount")
        const userData = await User.findOne({ id: user.id }) || new User({ id: user.id })

        embed = new EmbedBuilder().setColor('Yellow');
        
        if (userData.wallet < amount) return interaction.reply({
            embeds: [ embed.setDescription(`💰 You don't have enough money on your wallet to gamble! Maybe try gambling less...`) ],
            ephemeral: true
        })

        
        userData.wallet -= amount

        const items = ["💎","💸", "🍇", "🍓"];
        const multipliers = [25, 10, 5, 2.5];

        let basenum = Math.floor(items.length * Math.random())
        let $ = items[basenum];
        let $$ = items[Math.floor(items.length * Math.random())];
        let $$$ = items[Math.floor(items.length * Math.random())];

        const play = new EmbedBuilder()
            .setTitle('🎲 Slot Machine🎲')
            .setDescription(`• ⬛  ⬛  ⬛ •`)
            .setColor("Random")
            .addFields({name: "\u200B", value: `Currently gambling \` ${currencyPrefix}  ${amount} \``})
        const $1 = new EmbedBuilder()
            .setTitle('🎲 Slot Machine🎲')
            .setDescription(`• ${$}  ⬛  ⬛ •`)
            .setColor("Random")
            .addFields({name: "\u200B", value: `Currently gambling \` ${currencyPrefix}  ${amount} \``})
        const $2 = new EmbedBuilder()
            .setTitle('🎲 Slot Machine🎲')
            .setDescription(`• ${$}  ${$$}  ⬛ •`)
            .setColor("Random")
            .addFields({name: "\u200B", value: `Currently gambling \` ${currencyPrefix}  ${amount} \``})
        const $3 = new EmbedBuilder()
            .setTitle('🎲 Slot Machine🎲')
            .setDescription(`• ${$}  ${$$}  ${$$$} •`)
            .setColor("Random")
            .addFields({name: "\u200B", value: `Currently gambling \` ${currencyPrefix}  ${amount} \``})


        const lost = new EmbedBuilder()
            .setTitle('🎲 YOU LOSE! 🎲')
            .setDescription(`• ${$}  ${$$}  ${$$$} •`)
            .setColor("Red")
            .addFields({name: "\u200B" , value:`You lost \` ${currencyPrefix}  ${amount} \`!`});
        const won = new EmbedBuilder()
            .setTitle('🎲 YOU WON! 🎲')
            .setDescription(`• ${$}  ${$$}  ${$$$} •`)
            .setColor("Green")
            .addFields({name: "\u200B" , value:`You won \` ${currencyPrefix}  ${amount * multipliers[basenum]}\` from \` ${currencyPrefix} ${amount} \`! That's ${(multipliers[basenum] * 100) - 100}% profit!`});

        await interaction.reply({ embeds: [play] })
        await wait(2000)
        await interaction.editReply({embeds: [$1]})
        await wait(2000)
        await interaction.editReply({embeds: [$2]})
        await wait(2000)
        await interaction.editReply({embeds: [$3]})
        await wait(500)

        if($ === $$ && $ === $$$)
        {
            interaction.editReply({embeds: [won]})
            userData.wallet += amount * multipliers[basenum]

            userData.save()

        } else {
            interaction.editReply({embeds: [lost]})
            userData.save()

        }

    }  
} 